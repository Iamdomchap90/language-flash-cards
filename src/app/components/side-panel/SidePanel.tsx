'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import ToggleSwitch from '@/app/components/widgets/ToggleSwitch';

const MatchConfig = () => {
  // Radio select for text entry, multiple choice

  const [selectedConfig, setSelectedConfig] = useState<string>('text'); // Default selected Config

  const handleConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedConfig(event.target.value);
  };

  useEffect(() => {}, [selectedConfig]);

  return (
    <div className={styles.configContainer}>
      <div>
        <h2 className="long-text">Input method</h2>
      </div>
      <div>
        <ToggleSwitch
          value="text"
          isChecked={selectedConfig === 'text'}
          onConfigChange={handleConfigChange}
        >
          Text Entry
        </ToggleSwitch>
      </div>
      <div>
        <ToggleSwitch
          value="multipleChoice"
          isChecked={selectedConfig === 'multipleChoice'}
          onConfigChange={handleConfigChange}
        >
          Multiple Choice
        </ToggleSwitch>
      </div>
    </div>
  );
};

const FilterContainer = ({ filterCards, activeIndex }) => {
  // Radio select for verbs, nouns, adjectives, adverbs

  const handleFilterClick = (buttonIndex, wordType) => {
    filterCards(wordType, buttonIndex);
  };

  return (
    <div className={styles.configContainer}>
      <div>
        <h2 className="long-text">Vocabulary filter</h2>
      </div>
      <div>
        <button
          className={activeIndex === 0 ? 'btn activeBtn' : 'btn'}
          onClick={() => handleFilterClick(0, 'noun')}
        >
          Nouns
        </button>
      </div>
      <div>
        <button
          className={activeIndex === 1 ? 'btn activeBtn' : 'btn'}
          onClick={() => handleFilterClick(1, 'verb')}
        >
          Verbs
        </button>
      </div>
      <div>
        <button
          className={activeIndex === 2 ? 'btn activeBtn' : 'btn'}
          onClick={() => handleFilterClick(2, 'adjective')}
        >
          Adjectives
        </button>
      </div>
      <div>
        <button
          className={activeIndex === 3 ? 'btn activeBtn' : 'btn'}
          onClick={() => handleFilterClick(3, 'adverb')}
        >
          Adverbs
        </button>
      </div>
    </div>
  );
};

const SidePanel = ({ filterCards, activeIndex }) => {
  return (
    <div className={styles.panelContainer}>
      <MatchConfig />
      <FilterContainer filterCards={filterCards} activeIndex={activeIndex} />
    </div>
  );
};

export default SidePanel;
