'use client';
import React, { useState, useEffect, useCallback } from 'react';
import FlashBoard from '@/app/components/flash-cards/Flashcard';
import SidePanel from '@/app/components/side-panel/SidePanel';
import styles from './page.module.css';
import AuthArea from '@/app/components/auth-area/AuthArea';

const Vocabulary = () => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const fetchData = useCallback(
    async (lexicalCategory: string | null = null, buttonIndex: number | null = null):void => {
      setIsLoading(true);
      setIsError(false);

      try {
        const lexicalCategoryParameter = lexicalCategory
          ? `?wordType=${lexicalCategory}`
          : '';
        const response = await fetch(
          '/api/vocab-cards' + lexicalCategoryParameter
        );

        if (!response.ok) {
          let errorResponse = await response.json();
          throw new Error(errorResponse.error || 'Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
        setActiveButtonIndex(buttonIndex);
      } catch (error) {
        setIsError(true);
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handleNextCards = () => {};

  if (!hasMounted) {
    return <p>Loading...</p>; // Prevents rendering mismatched content
  }

  if (isLoading) {
    return <p>Loading vocabulary...</p>;
  }

  if (isError) {
    return <p>Something went wrong...</p>;
  }

  return (
    <>
      <div className={`${styles.headContainer}`}>
        <h1 className="header-text">Learn most commonly used words</h1>
        <AuthArea />
      </div>
      <div className={styles.boardContainer}>
        <FlashBoard data={data} updateNewCards={fetchData} />
      </div>
      <SidePanel filterCards={fetchData} activeIndex={activeButtonIndex} />
    </>
  );
};

export default Vocabulary;
