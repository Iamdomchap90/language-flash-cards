import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utils/db';
import VocabCard from '@/models/VocabCard';
import UserVocabCardProgress from '@/models/UserVocabCardProgress';
import { getUserID } from '@/utils/user';
import mongoose, { FilterQuery } from 'mongoose';
import { IVocabCard } from '@/types/models';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    console.log('VOCAB CARDS HIT!');
    const { searchParams } = new URL(request.url);
    const wordType = searchParams.get('wordType');
    let baseFilter = { language: 'Russian' };

    if (wordType) {
      baseFilter['wordType'] = wordType;
    }

    const userID = await getUserID();
    await connect();
    const randomVocabCards = await VocabCard.aggregate([
      { $match: baseFilter },
      { $sample: { size: 9 } },
    ]);

    if (!userID) {
      return new NextResponse(JSON.stringify(randomVocabCards), {
        status: 200,
      });
    } else {
      baseFilter['user'] = userID;
      const attemptedVocabCardIds = await UserVocabCardProgress.aggregate([
        { $match: baseFilter },
        { $group: { _id: null, ids: { $addToSet: '$vocabCard' } } }, // Collect unique vocabCard IDs
        { $unwind: '$ids' }, // Flatten the ids array
        { $project: { _id: 0, vocabCard: '$ids' } }, // Rename field to vocabCard
      ]).then((results) => results.map((doc) => doc.vocabCard));
      baseFilter['nextReviewedAt'] = { $lt: new Date() };
      const attemptedReviewVocabCardIds = await UserVocabCardProgress.aggregate(
        [
          { $match: baseFilter },
          { $group: { _id: null, ids: { $addToSet: '$vocabCard' } } }, // Collect unique vocabCard IDs
          { $unwind: '$ids' }, // Flatten the ids array
          { $project: { _id: 0, vocabCard: '$ids' } }, // Rename field to vocabCard
        ]
      ).then((results) => results.map((doc) => doc.vocabCard));

      const filterVocabCards = async (
        filter: FilterQuery<IVocabCard>
      ): Promise<VocabCardDocument[]> => {
        const query = {
          language: 'Russian',
          ...filter,
        };

        if (wordType) {
          query.wordType = wordType;
        }

        return await VocabCard.find(query);
      };

      const notAttemptedVocabCards = await filterVocabCards({
        _id: { $nin: attemptedVocabCardIds }, // Cards whose ID is NOT in the attempted list
      });

      const spacedRepetitionVocabCards = await filterVocabCards({
        _id: {
          $in: attemptedReviewVocabCardIds,
        },
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
