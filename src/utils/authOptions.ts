import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { generateThirtyDayActivity } from '@/models/User';
import connect from '@/utils/db';
import User from '@/models/User';
import { NextAuthOptions } from 'next-auth';

async function findOrCreateMongoUser(user: User):Promise<User>  {
  /*
  Looks for user in mongo db for an Oauth user,
  if unable to find will create mongo reference.
  */
  await connect();

  let existingUser = user?.email
    ? await User.findOne({ email: user.email })
    : await User.findOne({ username: user.username });
  if (!existingUser) {
    existingUser = await User.create({
      username: user.email,
      email: user.email,
      password: null, // OAuth users don’t have passwords
      Russian: {
        attemptedCardCount: 0,
        errorCount: 0,
        activeStreak: 0,
        longestStreak: 0,
        thirtyDayActivity: generateThirtyDayActivity(),
      },
    });
  }

  return existingUser;
}

const authOptions:NextAuthOptions = {
  providers: [
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.BASE_URL}/api/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        const user = await res.json();
        if (res.ok && user) {
          return user.user;
        }

        return null;
      },
    }),
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // clears guest users after 1 day
    updateAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await findOrCreateMongoUser(user);
        token.username = dbUser.username;
        token.id = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.username = token.username;
      session.user.id = token.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/vocabulary`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
