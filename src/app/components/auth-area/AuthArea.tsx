import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

const AuthArea = () => {
  const { data: session } = useSession();

  const t = useTranslations('AuthArea');

  if (session) {
    return (
      <div className="flex w-[16.67vw] items-end justify-between">
        <p>{session.user.username}</p>
        <button className="btn" onClick={() => signOut()}>
          {t('signOut')}
        </button>
      </div>
    );
  }
  return (
    <div className="flex w-[16.67vw] items-end justify-between">
      <p>{t('guest')}</p>
      <button className="btn" onClick={() => signIn()}>
        {t('signIn')}
      </button>
    </div>
  );
};

export default AuthArea;
