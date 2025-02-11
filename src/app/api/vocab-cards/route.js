import { NextResponse } from 'next/server';
import connect from '@/utils/db';
import VocabCard from '@/models/VocabCard';
import UserVocabCardProgress from '@/models/UserVocabCardProgress';
import { getUserID } from '@/utils/user';
import mongoose from 'mongoose';

export const GET = async (request) => {
  try {
    const userID = await getUserID();
    await connect();
    const randomVocabCards = await VocabCard.aggregate([
      { $match: { language: 'Russian' } },
      { $sample: { size: 9 } },
    ]);

    if (!userID) {
      return new NextResponse(JSON.stringify(randomVocabCards), {
        status: 200,
      });
    } else {
      const attemptedVocabCardIds = await UserVocabCardProgress.aggregate([
        { $match: { user: userID } },
        { $group: { _id: null, ids: { $addToSet: '$vocabCard' } } }, // Collect unique vocabCard IDs
        { $unwind: '$ids' }, // Flatten the ids array
        { $project: { _id: 0, vocabCard: '$ids' } }, // Rename field to vocabCard
      ]).then((results) => results.map((doc) => doc.vocabCard));

      const attemptedReviewVocabCardIds = await UserVocabCardProgress.aggregate(
        [
          { $match: { user: userID, nextReviewedAt: { $lt: new Date() } } },
          { $group: { _id: null, ids: { $addToSet: '$vocabCard' } } }, // Collect unique vocabCard IDs
          { $unwind: '$ids' }, // Flatten the ids array
          { $project: { _id: 0, vocabCard: '$ids' } }, // Rename field to vocabCard
        ]
      ).then((results) => results.map((doc) => doc.vocabCard));

      const notAttemptedVocabCards = await VocabCard.find({
        _id: { $nin: attemptedVocabCardIds }, // Cards whose ID is NOT in the attempted list
        language: 'Russian',
      });

      const spacedRepetitionVocabCards = await VocabCard.find({
        _id: {
          $in: attemptedReviewVocabCardIds,
        },
        language: 'Russian',
      });

      const reviewableVocabCards = [
        ...spacedRepetitionVocabCards,
        ...notAttemptedVocabCards,
      ];
      return new NextResponse(JSON.stringify(reviewableVocabCards), {
        status: 200,
      });
    }
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: 'Database Error: ' + err }),
      { status: 500 }
    );
  }
};
