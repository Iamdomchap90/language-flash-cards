'use client';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import AuthArea from '@/components/auth-area/AuthArea';
import { useSession, signIn, signOut } from 'next-auth/react';

const Statistics = () => {
  const { data: session } = useSession();
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  const fetchUserStats = async () => {
    const response = await fetch('api/stats/');
    if (!response.ok) {
      setError("Failed to fetch user's stats.");
    } else {
      const data = await response.json();
      setStatistics(data);
    }
    console.log('reponse: ', response);
  };

  useEffect(() => {
    console.log('USE EFFECT!');
    fetchUserStats();
  }, []);

  const userDisplay = session?.user.username;
  if (session?.user) {
    return (
      <div className="my-8 flex flex-col justify-center items-center h-[20vh]">
        <h1 className="my-4 header-text">Statistics</h1>
        <p className="mb-8">({userDisplay})</p>
        {statistics && (
          <ul>
            <li>Cards Attempted: {statistics?.uniqueAttempts}</li>
            <li>Card errors: {statistics?.uniqueErrors}</li>
            <li>Current Streak: {statistics?.activeStreak}</li>
            <li>Longest streak: {statistics?.longestStreak}</li>
          </ul>
        )}
      </div>
    );
  }
  return (
    <div className="flex w-[16.67vw] items-end justify-between">
      <p>No statistics available for guest user - please sign in.</p>
      <button className="btn" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  );
};

export default Statistics;
