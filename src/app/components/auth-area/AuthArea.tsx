import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthArea = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex w-[16.67vw] items-end justify-between">
        <p>{session.user.username}</p>
        <button className="btn" onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div className="flex w-[16.67vw] items-end justify-between">
      <p>Guest user </p>
      <button className="btn" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  );
};

export default AuthArea;
