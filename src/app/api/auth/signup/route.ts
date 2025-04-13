import { hash } from 'bcryptjs';
import connect from '@/utils/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { LoginBody } from '@/app/api/auth/login/route';

interface SignupBody extends LoginBody {
  email: string;
}

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  return new NextResponse('This route supports only POST requests.', {
    status: 405,
  });
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  if (req.method !== 'POST') {
    return new NextResponse(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
    });
  }
  const body = (await req.json()) as SignupBody;
  const { username, password, email } = body;
  if (!username || !password || !email) {
    return new NextResponse(
      JSON.stringify({ error: 'All fields are required.' }),
      {
        status: 400,
      }
    );
  }

  try {
    await connect();
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: 'Username is already taken.' }),
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);
    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email,
      createdAt: new Date(),
    });

    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: 'User created successfully.' }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error.' }),
      {
        status: 500,
      }
    );
  }
};
