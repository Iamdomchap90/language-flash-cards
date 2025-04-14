import bcrypt from 'bcryptjs';
import connect from '@/utils/db';
import User from '@/models/User';
import { NextAPIRequest, NextAPIResponse } from 'next';

export interface LoginBody {
  username: string;
  password: string;
}

export const GET = async (
  req: NextAPIRequest,
  res: NextAPIResponse
): Promise<NextAPIResponse> => {
  return res
    .status(405)
    .json({ error: 'This route supports only POST requests.' });
};

export const POST = async (
  req: NextAPIRequest,
  res: NextAPIResponse
): Promise<NextAPIResponse> => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const body = (await req.json()) as LoginBody;
  const { username, password } = body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required.' });
  }

  try {
    await connect();
    const existingUser = await User.findOne({ username });
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    } else {
      return res.status(200).json({
        user: {
          id: existingUser._id,
          username: existingUser.username,
          createdAt: existingUser.createdAt,
          updatedAt: existingUser.updatedAt,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
