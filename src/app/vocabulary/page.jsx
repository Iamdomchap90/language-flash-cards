"use client";
import React, {useState, useEffect} from 'react';
import FlashBoard from '@/components/flash-cards/Flashcard';
import SidePanel from '../side-panel/SidePanel';
import styles from './page.module.css';
// import getVocabCards from '../../lib/mongo/vocabulary';

const Vocabulary = () => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await fetch("/api/vocab-cards");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await response.json();
    console.log("RESULT: ", result);
    console.log("type: ", typeof result);
    setData(result);

    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong...</p>;
  }

  return (
    <>
    <div className={styles.headContainer}>
      <h1 className='header-text'>Learn most commonly used words</h1>
    </div>
    <div className={styles.boardContainer}>
      <FlashBoard data={data}/>
    </div>
    <SidePanel />
    </>
  );
}

export default Vocabulary
