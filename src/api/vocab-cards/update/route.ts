import connect from '@/utils/db';
import mongoose, { Types } from 'mongoose';
import { UserDocument, UserVocabCardProgressDocument } from '@/types/models';
import { NextResponse } from 'next/server';
import UserVocabCardProgress from '@/models/UserVocabCardProgress';
import getUser, { getUserID } from '@/utils/user';
import authOptions from '@/utils/authOptions';

const getNextReviewDate = (
  isCorrect: boolean,
  attemptCount: number,
  failedAttemptCount: number,
  date: Date = new Date()
): Date => {
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

const updateStreak = async (updateId: Types.ObjectId, updateUser: UserDocument): Promise<UserDocument> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const results = await UserVocabCardProgress.find({ user: updateId })
    .sort({ updatedAt: -1 })
    .select("updatedAt")
    .lean();

  const recentDate = results.length > 0 ? new Date(results[0].updatedAt) : null;
  // Reset time to 00:00:00 if there's a valid date
  recentDate?.setHours(0, 0, 0, 0);

  if (!recentDate || (recentDate.getTime() === yesterday.getTime())) {
    ++updateUser.Russian.activeStreak;
    if (updateUser.Russian.activeStreak > updateUser.Russian.longestStreak)
        updateUser.Russian.longestStreak = updateUser.Russian.activeStreak;
  } else if (recentDate.getTime() < yesterday.getTime()) {
      updateUser.Russian.activeStreak = 0;
  }
  return updateUser;

}

const updateUserStats = async (id:, correctAttempt: boolean, existingUserCardProgress: UserVocabCardProgressDocument):Promise<void> => {
  try {
    let user = await getUser();

    if (!existingUserCardProgress) {
     ++user.Russian.attemptedCardCount;
     if (!correctAttempt)
        ++user.Russian.errorCount;
    }
    user = await updateStreak(id, user);

    user.save();
  } catch (err) {
    console.log("ERROR: ", err)
  }
}

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
