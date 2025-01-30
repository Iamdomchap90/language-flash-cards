import { hash } from 'bcryptjs';
import connect from '@/utils/db';
import User from '@/models/User';

export const GET = async (req, res) => {
  return new Response('This route supports only POST requests.', {
    status: 405,
  });
};

export const POST = async (req, res) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
    });
  }
  const body = await req.json();
  const { username, password } = body || {};

  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: 'Username and password are required.' }),
      { status: 400 }
    );
  }

  try {
    await connect();
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Username is already taken.' }),
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);
    const newUser = new User({
      username: username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ message: 'User created successfully.' }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
    });
  }
};
