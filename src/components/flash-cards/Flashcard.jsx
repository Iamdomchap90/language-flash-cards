import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

const FlashCard = ({ cardData, cardIndex, onAnswerUpdate, isBoardReset }) => {
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

  const displayText = isFlipped
    ? cardData.translationText
    : cardData.englishText;

  useEffect(() => {
    if (isBoardReset) {
      setInputValue('');
      setIsAnswerCorrect(null);
      setIsZoomed(false);
    }
  }, [isBoardReset]);

  const feedbackStyling =
    isAnswerCorrect === null ? '' : isAnswerCorrect ? 'correct' : 'incorrect';

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

const FlashRow = ({
  rowData,
  rowIndex,
  onAnswerUpdate,
  numCardsPerRow,
  isBoardReset,
}) => {
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
            isBoardReset={isBoardReset}
          />
        );
      })}
    </div>
  );
};

const FlashBoard = ({ data }) => {
  const numberOfRows = 3;
  const numberOfColumns = 3;
  const numberOfCards = numberOfRows * numberOfColumns;
  const [errorCount, setErrorCount] = useState([0]);
  const [answerCount, setAnswerCount] = useState([0]);
  const [answerResults, setAnswerResults] = useState(
    new Array(numberOfCards).fill(null)
  );
  const [isBoardComplete, setIsBoardComplete] = useState(false);
  const [isBoardReset, setIsBoardReset] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getUser = () => {
    const user = sessionStorage.getItem('user'); // Example of accessing the logged-in user from sessionStorage
    return user || 'guest'; // Default to 'guest' if no user found
  };

  const handleAnswerUpdate = (cardIndex, cardID, isCorrect) => {
    setAnswerResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[cardIndex] = {
        cardID: cardID,
        isCorrect: isCorrect,
        user: getUser(),
        lastAttempted: new Date().toISOString(),
      };
      return updatedResults;
    });
  };

  const newBoard = () => {
    setErrorCount(0);
    setAnswerCount(0);
    setAnswerResults(new Array(numberOfCards).fill(null));
  };

  const retryBoard = () => {
    setAnswerResults(new Array(numberOfCards).fill(null));
    setIsBoardReset(true);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const errorCount = answerResults.filter(
      (answer) => answer && answer.isCorrect === false
    ).length;
    setErrorCount(errorCount);
    const answerCount = answerResults.filter((answer) => answer).length;
    setAnswerCount(answerCount);
    setIsBoardComplete(answerCount === numberOfCards);
    setIsModalOpen(answerCount === numberOfCards);
    setIsBoardReset(false); // After checking first answer after reset.
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
              isBoardReset={isBoardReset}
            />
          );
        })}
      </div>
      {isModalOpen && (
        <div
          id="boardCompleteModal"
          className="modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[300px] bg-purple-500 z-[1000]"
        >
          <div className="w-full h-[20px]">
            <span
              className="close-button float-right"
              id="close-modal"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              &times;
            </span>
          </div>
          <div className="modal-content container grid h-[200px] mt-[30px] place-items-center">
            <h2 className="text-center header-text">Board complete!</h2>
            <p className="text-center long-text">
              You scored {answerCount - errorCount} out of {answerCount}
            </p>
            <div className="modalButtonContainer grid grid-cols-2 gap-4 text-center">
              <button className="btn bg-green-500" onClick={newBoard}>
                Next Board
              </button>
              <button className="btn bg-gray-500" onClick={retryBoard}>
                Retry Board
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashBoard;
