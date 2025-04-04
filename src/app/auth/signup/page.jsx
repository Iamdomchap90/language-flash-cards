'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);
  const emailRegex = /^\S+@\S+\.\S+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (emailError) {
      setError('Give a valid email.');
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
      setError(data.error || 'An unexpected error occurred.');
    }
  };

  const validateEmail = (dirtyEmail) => {
    setEmail(dirtyEmail);

    if (!emailRegex.test(dirtyEmail)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="authContainer">
      <h1 className="text-center mb-4 header-text">Sign Up</h1>
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
          <label className="w-full block text-left">Email</label>
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
          <label className="w-full block text-left">Password</label>
          <input
            className="w-full input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-center formSpacing">
          <label className="w-full block text-left">Confirm Password</label>
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
            Sign Up
          </button>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <div className="modal ">
          <h2 className="mt-[90px] text-center header-text">
            Sign-up successful! You can now log in.
          </h2>
          <div className="w-full formSpacing ">
            <Link href="/auth/login" className="btn">
              Go to Log in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
