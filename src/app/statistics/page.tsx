'use client';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import AuthArea from '@/components/auth-area/AuthArea';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const Statistics = () => {
  const { data: session } = useSession();
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  const fetchUserStats = async () => {
    const response = await fetch('api/stats/');
    if (!response.ok) {
      setError("Failed to fetch user's stats.");
    } else {
      let data = await response.json();
      setStatistics(data);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  const userDisplay = session?.user.username;
  if (session?.user) {
    return (
      <div className="my-8 flex flex-col justify-center items-center">
        <h1 className="my-4 header-text">Statistics</h1>
        <p className="mb-8 long-text">({userDisplay})</p>
        {statistics && (
          <>
            <ul className="mb-8 long-text">
              <li>Cards Attempted: {statistics?.uniqueAttempts}</li>
              <li>Card errors: {statistics?.uniqueErrors}</li>
              <li>Current Streak: {statistics?.activeStreak}</li>
              <li>Longest streak: {statistics?.longestStreak}</li>
            </ul>
            <h2 className="w-[600px] p-[40px] long-text font-bold">
              Recent Activity
            </h2>
            <div className="w-full justify-center flex">
              <ResponsiveContainer width={600} height={400}>
                <LineChart data={statistics.thirtyDayActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line dataKey="y" type="monotone" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
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
