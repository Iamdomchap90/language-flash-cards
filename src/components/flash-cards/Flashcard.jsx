import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

const FlashCard = ({ cardData, cardIndex, onAnswerUpdate }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // null = unanswered
  const handleCardClick = () => {
    setIsZoomed(true);
  };
  const handleCheckAnswerClick = () => {
    const isCorrect = cardData.translationText === inputValue;
    const cardID = cardData._id;
    setIsAnswerCorrect(isCorrect);
    onAnswerUpdate(cardIndex, cardID, isCorrect);
  };
  const feedbackStyling =
    isAnswerCorrect === null ? '' : isAnswerCorrect ? 'correct' : 'incorrect';
  const displayText = isFlipped
    ? cardData.translationText
    : cardData.englishText;

  let feedbackMessage;
  if (isAnswerCorrect === null) {
    feedbackMessage = (
      <button
        className={`${styles.answerButton} text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
        onClick={handleCheckAnswerClick}
      >
        Check answer
      </button>
    );
  } else if (isAnswerCorrect === true) {
    feedbackMessage = (
      <p className="feedbackText">Well done, correct answer!</p>
    );
  } else {
    feedbackMessage = (
      <p className="feedbackText">
        Better luck next time. Correct answer is {cardData.translationText}.
      </p>
    );
  }

  return (
    <div
      className={`${styles.cardContainer} ${feedbackStyling} ${isZoomed ? styles.zoomed : ''}`}
      onClick={handleCardClick}
    >
      <div className="flex w-full justify-center">
        {isZoomed && <div className="w-1/6"></div>}
        <div className={`${styles.cardTextContainer} ${isZoomed && 'w-4/6'}`}>
          <p className={styles.cardText}>{displayText}</p>
        </div>
        {isZoomed && (
          <div className="w-1/6 flex justify-end items-start">
            <div
              className="minimiserButton"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the card click event from firing
                setIsZoomed(false);
              }}
            >
              -
            </div>
          </div>
        )}
      </div>
      {isZoomed && (
        <>
          <div className={styles.answerContainer}>
            <input
              type="text"
              className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:outline-none block w-4/12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${styles.answerInput}`}
              placeholder="Your translation..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className={styles.answerButtonContainer}>{feedbackMessage}</div>
        </>
      )}
    </div>
  );
};

const FlashRow = ({ rowData, rowIndex, onAnswerUpdate, numCardsPerRow }) => {
  return (
    <div className={styles.boardRowContainer}>
      {rowData.map((cardData, columnIndex) => {
        const cardIdentifier = rowIndex * numCardsPerRow + columnIndex;
        return (
          <FlashCard
            key={cardIdentifier}
            cardData={cardData}
            cardIndex={cardIdentifier}
            onAnswerUpdate={onAnswerUpdate}
          />
        );
      })}
    </div>
  );
};

const FlashBoard = ({ data }) => {
  const numberOfRows = 3;
  const numberOfColumns = 3;
  const [errorCount, setErrorCount] = useState([0]);
  const [answerCount, setAnswerCount] = useState([0]);
  const [answerResults, setAnswerResults] = useState(
    new Array(numberOfRows * numberOfColumns).fill(null)
  );

  const getUser = () => {
    const user = sessionStorage.getItem('user'); // Example of accessing the logged-in user from sessionStorage
    return user || 'guest'; // Default to 'guest' if no user found
  };

  function handleAnswerUpdate(cardIndex, cardID, isCorrect) {
    setAnswerResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[cardIndex] = {
        cardID: cardID,
        isCorrect: isCorrect,
        user: getUser(),
      };
      return updatedResults;
    });
  }

  useEffect(() => {
    const errorCount = answerResults.filter(
      (answer) => answer && answer.isCorrect === false
    ).length;
    setErrorCount(errorCount);
    const answerCount = answerResults.filter((answer) => answer).length;
    setAnswerCount(answerCount);
  }, [answerResults]);
  return (
    <>
      <div className={styles.errorDisplayContainer}>
        <div className={styles.errorDisplay}>
          {errorCount} error{errorCount !== 1 && 's'} out of {answerCount}
        </div>
      </div>
      <div className={styles.boardContainer}>
        {Array.from({ length: numberOfRows }).map((_, index) => {
          const startIndex = index * numberOfColumns;
          const endIndex = startIndex + numberOfColumns;
          const rowData = data.slice(startIndex, endIndex);
          return (
            <FlashRow
              key={index}
              rowData={rowData}
              rowIndex={index}
              onAnswerUpdate={handleAnswerUpdate}
              numCardsPerRow={numberOfColumns}
            />
          );
        })}
      </div>
    </>
  );
};

export default FlashBoard;
