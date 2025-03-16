'use client';
import React, { useState, useEffect, useCallback } from 'react';
import FlashBoard from '@/components/flash-cards/Flashcard';
import SidePanel from '../side-panel/SidePanel';
import styles from './page.module.css';
import AuthArea from '@/components/auth-area/AuthArea';
// import getVocabCards from '../../lib/mongo/vocabulary';

const Vocabulary = () => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);

  const fetchData = useCallback(
    async (lexicalCategory = null, buttonIndex = null) => {
      setIsLoading(true);
      console.log('called with (FETCH DATA): ', lexicalCategory);
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

      setIsLoading(false);
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handleNextCards = () => {};

  if (isLoading) {
    return <p>Loading...</p>;
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
