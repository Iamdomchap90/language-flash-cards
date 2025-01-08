import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

const FlashCard = ({ card_data }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // null = unanswered
  const handleCardClick = () => {
    setIsZoomed(true);
  };
  const handleCheckAnswerClick = () => {
    setIsAnswerCorrect(card_data.translationText === inputValue);
  };
  const feedbackStyling =
    isAnswerCorrect === null ? '' : isAnswerCorrect ? 'correct' : 'incorrect';
  const displayText = isFlipped
    ? card_data.translationText
    : card_data.englishText;

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
        Better luck next time. Correct answer is {card_data.translationText}.
      </p>
    );
  }

  return (
    <div
      className={`${styles.cardContainer} ${feedbackStyling} ${isZoomed ? styles.zoomed : ''}`}
      onClick={handleCardClick}
    >
      <div className="flex w-full justify-center">
        {isZoomed && (
          <div className="w-1/6"></div>
        )}
        <div className={`${styles.cardTextContainer} ${isZoomed && "w-4/6"}`}>
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

const FlashRow = ({ row_data }) => {
  return (
    <div className={styles.boardRowContainer}>
      {row_data.map((cardData, index) => (
        <FlashCard key={index} card_data={cardData} />
      ))}
    </div>
  );
};

const FlashBoard = ({ data }) => {
  const numberOfRows = 3;
  const numberOfCardsPerRow = 3;
  return (
    <div className={styles.boardContainer}>
      {Array.from({ length: numberOfRows }).map((_, index) => {
        const startIndex = index * numberOfCardsPerRow;
        const endIndex = startIndex + numberOfCardsPerRow;
        const rowData = data.slice(startIndex, endIndex);
        return <FlashRow key={index} row_data={rowData} />;
      })}
    </div>
  );
};

export default FlashBoard;
