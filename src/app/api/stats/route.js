import { NextResponse } from 'next/server';
import connect from '@/utils/db';
import getUser from '@/utils/user';

export const GET = async (request) => {
  try {
    const user = await getUser();
    const stats = {
      uniqueAttempts: user.Russian.attemptedCardCount,
      uniqueErrors: user.Russian.errorCount,
      activeStreak: user.Russian.activeStreak,
      longestStreak: user.Russian.longestStreak,
    };
    return new NextResponse(JSON.stringify(stats), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: 'Database Error: ' + err }),
      { status: 500 }
    );
  }
};
