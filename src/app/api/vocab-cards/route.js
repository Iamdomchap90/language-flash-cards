import { NextResponse } from 'next/server';
import connect from '@/utils/db';
import VocabCard from '@/models/VocabCard';

export const GET = async (request) => {
  try {
    await connect();
    const vocabCards = await VocabCard.find();
    return new NextResponse(JSON.stringify(vocabCards), { status: 200 });
  } catch (err) {
    return new NextResponse('Database Error: ' + err, { status: 500 });
  }
};
