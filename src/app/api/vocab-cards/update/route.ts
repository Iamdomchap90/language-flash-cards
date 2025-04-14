import connect from '@/utils/db';
import mongoose, { Types } from 'mongoose';
import { UserDocument, UserVocabCardProgressDocument } from '@/types/models';
import { NextRequest, NextResponse } from 'next/server';
import UserVocabCardProgress from '@/models/UserVocabCardProgress';
import getUser, { getUserID } from '@/utils/user';

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

const updateThirtyDayActivity = (activityUser: UserDocument): UserDocument => {
  let thirtyDayActivityKeys = Array.from(
    activityUser.Russian.thirtyDayActivity.keys()
  );
  let today = new Date();
  const mostRecentDayStr = thirtyDayActivityKeys.at(-1);
  const mostRecentDay = new Date(mostRecentDayStr + 'T00:00:00Z');
  const todayStr = today.toISOString().split('T')[0];
  const millisecsInDay = 1000 * 60 * 60 * 24;
  today.setHours(0, 0, 0, 0);
  let thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
  // Work out date 30 days ago. Remove keys
  // as old and older than that date.
  thirtyDayActivityKeys.forEach((dateStr) => {
    if (dateStr <= thirtyDaysAgoStr) {
      activityUser.Russian.thirtyDayActivity.delete(dateStr);
    }
  });

  // Fill all dates between last date and today with 0.
  if (mostRecentDay < today) {
    const daysDifference =
      (today.getTime() - mostRecentDay.getTime()) / millisecsInDay;
    for (let day = 1; day < daysDifference; day++) {
      let zeroTimestamp = mostRecentDay.getTime() + day * millisecsInDay;
      let zeroDate = new Date(zeroTimestamp);
      let zeroDateStr = zeroDate.toISOString().split('T')[0];
      activityUser.Russian.thirtyDayActivity.set(zeroDateStr, 0);
    }
  }

  // Does today's date exist as key if so imply increment by 1
  if (thirtyDayActivityKeys.includes(todayStr)) {
    let originalVal = activityUser.Russian.thirtyDayActivity.get(
      todayStr
    ) as number;
    activityUser.Russian.thirtyDayActivity.set(todayStr, originalVal + 1);
  } else {
    activityUser.Russian.thirtyDayActivity.set(todayStr, 1);
  }

  return activityUser;
};

const updateStreak = async (
  updateId: Types.ObjectId,
  updateUser: UserDocument
): Promise<UserDocument> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const results = await UserVocabCardProgress.find({ user: updateId })
    .sort({ updatedAt: -1 })
    .select('updatedAt')
    .lean();

  const recentDate = results.length > 0 ? new Date(results[0].updatedAt) : null;
  // Reset time to 00:00:00 if there's a valid date
  recentDate?.setHours(0, 0, 0, 0);

  if (!recentDate || recentDate.getTime() === yesterday.getTime()) {
    ++updateUser.Russian.activeStreak;
    if (updateUser.Russian.activeStreak > updateUser.Russian.longestStreak)
      updateUser.Russian.longestStreak = updateUser.Russian.activeStreak;
  } else if (recentDate.getTime() < yesterday.getTime()) {
    updateUser.Russian.activeStreak = 0;
  }
  return updateUser;
};

const updateUserStats = async (
  id: Types.ObjectId,
  correctAttempt: boolean,
  existingUserCardProgress: UserVocabCardProgressDocument
): Promise<void> => {
  try {
    let user = await getUser();

    if (!existingUserCardProgress) {
      ++user.Russian.attemptedCardCount;
      if (!correctAttempt) ++user.Russian.errorCount;
    }
    user = await updateStreak(id, user);
    user = updateThirtyDayActivity(user);
    user.save();
  } catch (err) {
    console.log('ERROR: ', err);
  }
};

export const POST = async (request: NextRequest) => {
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
    const vocabCardID = new mongoose.Types.ObjectId(cardID);
    await connect();
    const cardProgress = (await UserVocabCardProgress.findOne({
      user: userID,
      vocabCard: vocabCardID,
    })) as UserVocabCardProgressDocument;

    await updateUserStats(userID, isCorrect, cardProgress);
    const totalAttempts = (cardProgress?.totalAttempts || 0) + 1;
    const incorrectAnswerCountUnchanged =
      cardProgress?.incorrectAnswerCount || 0;
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
