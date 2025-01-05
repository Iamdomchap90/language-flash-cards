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
        className={`${styles.answerButton} primary`}
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
      {isZoomed && (
        <div className="minimiserButtonContainer">
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
      <div className="justify-center w-full">
        <p className={styles.cardText}>{displayText}</p>
      </div>
      {isZoomed && (
        <>
          <div className={styles.answerContainer}>
            <input
              type="text"
              className={`focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow focus:ring-offset-yellow ${styles.answerInput}`}
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
  console.log('ROW DATA: ', row_data);
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
  console.log('Flash Board data: ', data);
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
