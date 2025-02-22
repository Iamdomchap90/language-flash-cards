import NextAuth from 'next-auth';
import authOptions from '@/utils/authOptions';

export const handler = NextAuth.default(authOptions);

export { handler as GET, handler as POST };
