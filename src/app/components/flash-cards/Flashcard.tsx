'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { VocabCardDocument } from '@/types/models';
import { FilterCardsCallbackType } from '@/types/callbacks';
import { Types } from 'mongoose';
import { useTranslations } from 'next-intl';

type updateCardCallbackType = (
  cardIndex: number,
  cardID: Types.ObjectId,
  isCorrect: boolean
) => void;

type FlashCardProps = {
  cardData: VocabCardDocument;
  cardIndex: number;
  onAnswerUpdate: updateCardCallbackType;
  isBoardReset: boolean;
  cardLang: string;
};

type FlashRowProps = {
  rowData: VocabCardDocument[];
  rowIndex: number;
  onAnswerUpdate: updateCardCallbackType;
  numCardsPerRow: number;
  isBoardReset: boolean;
  rowLang: string;
};

type FlashBoardProps = {
  data: VocabCardDocument[];
  updateNewCards: FilterCardsCallbackType;
  activeButtonIndex: number | null;
  boardLang: string;
  wordType: string | null;
};

const FlashCard: React.FC<FlashCardProps> = ({
  cardData,
  cardIndex,
  onAnswerUpdate,
  isBoardReset,
  cardLang,
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const handleCardClick = () => {
    setIsZoomed(true);
  };
  let displayText;
  let answerText;

  if (cardLang !== 'en') {
    displayText = cardData.translationText;
    answerText = cardData.englishText;
  } else {
    displayText = cardData.englishText;
    answerText = cardData.translationText;
  }

  const t = useTranslations('FlashCard');

  const handleCheckAnswerClick = () => {
    const isCorrect = answerText === inputValue;
    const cardID = cardData._id;
    setIsAnswerCorrect(isCorrect);
    onAnswerUpdate(cardIndex, cardID, isCorrect);
  };

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
        {t('checkAnswer')}
      </button>
    );
  } else if (isAnswerCorrect === true) {
    feedbackMessage = <p className="feedbackText">{t('correctMessage')}</p>;
  } else {
    feedbackMessage = (
      <p className="feedbackText">
        {t('incorrectMessage')}
        {answerText}.
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

const FlashRow: React.FC<FlashRowProps> = ({
  rowData,
  rowIndex,
  onAnswerUpdate,
  numCardsPerRow,
  isBoardReset,
  rowLang,
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
            cardLang={rowLang}
          />
        );
      })}
    </div>
  );
};

const FlashBoard: React.FC<FlashBoardProps> = ({
  data,
  updateNewCards,
  activeButtonIndex,
  boardLang,
  wordType,
}) => {
  const numberOfRows = 3;
  const numberOfColumns = 3;
  const numberOfCards = Math.min(data.length, numberOfRows * numberOfColumns);
  const [errorCount, setErrorCount] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);
  const [isBoardComplete, setIsBoardComplete] = useState(false);
  const [isBoardReset, setIsBoardReset] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const t = useTranslations('FlashBoard');

  const handleAnswerUpdate = async (
    cardIndex: number,
    cardID: Types.ObjectId,
    isCorrect: boolean
  ) => {
    try {
      const response = await fetch('/api/vocab-cards/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardIndex, cardID, isCorrect }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log('Failed to update. ', data.message);
      }
      setErrorCount(Number(errorCount) + Number(!isCorrect));
      setAnswerCount(Number(answerCount) + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const newBoard = () => {
    setErrorCount(0);
    setAnswerCount(0);
    updateNewCards(wordType, activeButtonIndex);
  };

  const retryBoard = () => {
    setIsBoardReset(true);
    setErrorCount(0);
    setAnswerCount(0);
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsBoardReset(false);
    if (isFirstRender) {
      // Exit early on the first render
      setIsFirstRender(false);
      return;
    }
    setIsModalOpen(answerCount == numberOfCards);
  }, [answerCount]);

  return (
    <>
      <div className={styles.errorDisplayContainer} data-testid="error-display">
        <div className={styles.errorDisplay}>
          {errorCount} {t('error', { count: errorCount })} {t('fraction')}
          {answerCount}
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
              rowLang={boardLang}
            />
          );
        })}
      </div>
      {isModalOpen && (
        <div id="boardCompleteModal" className="modal">
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
              {t('scoreMessage')}
              {answerCount - errorCount} {t('fraction')}
              {answerCount}
            </p>
            <div className="modalButtonContainer grid grid-cols-2 gap-4 text-center">
              <button className="btn bg-green-500" onClick={newBoard}>
                {t('next')}
              </button>
              <button className="btn bg-gray-500" onClick={retryBoard}>
                {t('retry')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashBoard;
