import connect from '@/utils/db';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import UserVocabCardProgress from '@/models/UserVocabCardProgress';
import getUser, { getUserID } from '@/utils/user';
import authOptions from '@/utils/authOptions';

const getNextReviewDate = (
  isCorrect,
  attemptCount,
  failedAttemptCount,
  date = new Date()
) => {
  // Apply spaced repetition rules to get next date card is to be reviewed
  const successRate = (attemptCount - failedAttemptCount) / attemptCount;
  if (!isCorrect) {
    date.setMinutes(date.getMinutes() + 10);
  } else {
    if (successRate > 0.9) {
      date.setDate(date.getDate() + 14);
    } else if (successRate > 0.75) {
      date.setDate(date.getDate() + 7);
    } else if (successRate > 0.5) {
      date.setDate(date.getDate() + 3);
    } else {
      date.setDate(date.getDate() + 1);
    }
  }
  return date;
};

const updateStreak = async (updateId, updateUser) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const results = await UserVocabCardProgress.find({ user: updateId })
    .sort({ updatedAt: -1 }) // Sort by updatedAt descending (latest first)
    .select('updatedAt') // Only fetch updatedAt field
    .lean(); // Convert documents to plain objects

  const recentDate = results.length > 0 ? new Date(results[0].updatedAt) : null;
  console.log();
  // Reset time to 00:00:00 if there's a valid date
  recentDate?.setHours(0, 0, 0, 0);

  console.log('RECENT DATE: ', recentDate);
  if (
    recentDate.getTime() === today.getTime() &&
    updateUser.Russian.activeStreak !== 0
  ) {
    console.log('1');
  } else if (recentDate.getTime() < yesterday.getTime()) {
    console.log('2 HIT');
    updateUser.Russian.activeStreak = 0;
  } else {
    console.log('3 HIT');
    ++updateUser.Russian.activeStreak;
    if (updateUser.Russian.activeStreak > updateUser.Russian.longestStreak)
      updateUser.Russian.longestStreak = updateUser.Russian.activeStreak;
  }
  return updateUser;
};

const updateUserStats = async (
  id,
  correctAttempt,
  existingUserCardProgress
) => {
  try {
    let user = await getUser();
    console.log('User: ', user);
    console.log('existingUserCardProgress: ', existingUserCardProgress);
    if (!existingUserCardProgress) {
      ++user.Russian.attemptedCardCount;
      if (!correctAttempt) ++user.Russian.errorCount;
    }
    user = await updateStreak(id, user);
    console.log('user AFTER update: ', user);

    user.save();
  } catch (err) {
    console.log('ERROR: ', err);
  }
};

export const POST = async (request) => {
  try {
    const { cardIndex, cardID, isCorrect } = await request.json();
    const userID = await getUserID();

    if (!userID) {
      return new NextResponse(
        JSON.stringify({
          message: 'No progress recorded as user is not logged in.',
        }),
        {
          status: 200,
        }
      );
    }
    const vocabCardID = mongoose.Types.ObjectId(cardID);
    await connect();
    const userVocabCardProgress = await UserVocabCardProgress.findOne({
      user: userID,
      vocabCard: vocabCardID,
    });
    await updateUserStats(userID, isCorrect, userVocabCardProgress);
    const totalAttempts = (UserVocabCardProgress?.totalAttempts || 0) + 1;
    const incorrectAnswerCountUnchanged =
      userVocabCardProgress?.incorrectAnswerCount || 0;
    const incorrectAnswerCount = isCorrect
      ? incorrectAnswerCountUnchanged
      : incorrectAnswerCountUnchanged + 1;
    const nextReviewDate = getNextReviewDate(
      isCorrect,
      totalAttempts,
      incorrectAnswerCount
    );
    const updatedCardProgress = await UserVocabCardProgress.findOneAndUpdate(
      { user: userID, vocabCard: vocabCardID },
      {
        $set: {
          isCorrect: isCorrect,
          lastAttemptedAt: new Date().toISOString(),
          nextReviewedAt: nextReviewDate,
        },
        $inc: { totalAttempts: 1, incorrectAnswerCount: isCorrect ? 0 : 1 },
        $setOnInsert: { user: userID, vocabCard: vocabCardID }, // Set only when inserting
      },
      { upsert: true, new: true }
    );
    return new NextResponse(JSON.stringify(updatedCardProgress), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: `Database Error: ${err}` }),
      { status: 500 }
    );
  }
};
