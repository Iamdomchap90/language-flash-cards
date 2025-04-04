'use client';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
      callbackUrl: '/vocabulary',
    });
    if (result?.error) {
      alert('Invalid username or password.');
    } else {
      window.location.href = '/vocabulary';
    }
  };

  return (
    <div className="authContainer">
      <h1 className="text-center mb-4 header-text">Log in</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center formSpacing">
          <label className="w-full block text-left">Username</label>
          <input
            className="w-full input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-center formSpacing">
          <label className="w-full block text-left">Password</label>
          <input
            className="w-full input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="formSpacing">
          <button className="btn" type="submit">
            Log in
          </button>
        </div>
      </form>

      <p className="my-5">Don't have an account?</p>
      <div className="flex justify-between px-10">
        <Link
          href="/auth/signup"
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
        >
          Sign up
        </Link>
        <button className="btn" onClick={() => signIn('google')}>
          <FontAwesomeIcon icon={faGoogle} className="mr-2 w-5 h-5" />
          Log in with Google
        </button>
      </div>
    </div>
  );
}
