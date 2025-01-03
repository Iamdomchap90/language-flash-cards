import React, {useState, useEffect} from 'react';
import styles from './page.module.css';

const FlashCard = ({card_data}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleCardClick = () => {
    setIsFlipped((prevState) => !prevState);
  };
  const displayText = isFlipped? card_data.translationText: card_data.englishText
  return (
    <div className={styles.cardContainer} onClick={handleCardClick}>
      <p className={styles.cardText} >{displayText}</p>
    </div>
  )
}

const FlashRow = ({row_data}) => {
  console.log('ROW DATA: ', row_data)
  return (
    <div className={styles.boardRowContainer}>
      {row_data.map((cardData, index) => (
        <FlashCard key={index} card_data={cardData} />
      ))}
    </div>
  );
}

const FlashBoard = ({data}) => {
  const numberOfRows = 3;
  const numberOfCardsPerRow = 3;
  console.log("Flash Board data: ", data);
  return (
    <div className={styles.boardContainer}>
      {Array.from({ length: numberOfRows }).map((_, index) => {
        const startIndex = index * numberOfCardsPerRow;
        const endIndex = startIndex + numberOfCardsPerRow;
        const rowData = data.slice(startIndex, endIndex);
        return <FlashRow key={index} row_data={rowData} />
      })}
    </div>
  );
}

export default FlashBoard
