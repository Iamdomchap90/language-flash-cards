import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      username?: string;
      id?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string;
    id?: string;
  }
}
