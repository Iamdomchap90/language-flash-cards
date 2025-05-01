'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);
  const emailRegex = /^\S+@\S+\.\S+$/;

  const t = useTranslations('SigninPage');
  const tl = useTranslations('Labels');
  const errorTranslate = useTranslations('errors');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError(t('passwordError'));
      return;
    }

    if (emailError) {
      setError(t('emailError'));
      return;
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    });

    if (response.ok) {
      setSuccess(true);
    } else {
      const data = await response.json();
      console.log('DATA: ', data);
      setError(data.error || errorTranslate('unexpected'));
    }
  };

  const validateEmail = (dirtyEmail: string) => {
    setEmail(dirtyEmail);

    if (!emailRegex.test(dirtyEmail)) {
      setEmailError(errorTranslate('emailFormat'));
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="authContainer">
      <h1 className="text-center mb-4 header-text">{t('title')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center formSpacing">
          <label className="w-full block text-left">{tl('username')}</label>
          <input
            className="w-full input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-center formSpacing">
          <label className="w-full block text-left">{tl('email')}</label>
          <input
            className="w-full input"
            type="text"
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
            required
          />
          {emailError && (
            <p className="w-full text-left text-red-500">{emailError}</p>
          )}
        </div>
        <div className="flex flex-col items-center formSpacing">
          <label className="w-full block text-left">{tl('password')}</label>
          <input
            className="w-full input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-center formSpacing">
          <label className="w-full block text-left">
            {tl('confirmPassword')}
          </label>
          <input
            className="w-full input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="formSpacing">
          <button className="btn" type="submit">
            {t('title')}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <div className="modal ">
          <h2 className="mt-[90px] text-center header-text">
            {t('SignupMessage')}
          </h2>
          <div className="w-full formSpacing ">
            <Link href="/auth/login" className="btn">
              {t('loginPrompt')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
