import bcrypt from 'bcryptjs';
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
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
      });
    } else {
      return new Response(
        JSON.stringify({
          user: {
            id: existingUser._id,
            username: existingUser.username,
            createdAt: existingUser.createdAt,
            updatedAt: existingUser.updatedAt,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
    });
  }
};
