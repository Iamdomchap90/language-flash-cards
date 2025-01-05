'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import ToggleSwitch from '@/components/widgets/ToggleSwitch';
import Button from '@/components/widgets/Button';

const MatchConfig = () => {
  // Radio select for text entry, multiple choice

  const [selectedConfig, setSelectedConfig] = useState('text'); // Default selected Config

  const handleConfigChange = (event) => {
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

const FilterContainer = () => {
  // Radio select for verbs, nouns, adjectives, adverbs
  const [selectedFilter, setSelectedFilter] = useState('all'); // Default selected Config

  const handleFilterClick = (value) => {
    setSelectedFilter(value);
  };

  useEffect(() => {}, [selectedFilter]);

  return (
    <div className={styles.configContainer}>
      <div>
        <h2 className="long-text">Vocabulary filter</h2>
      </div>
      <div>
        <Button onClick={handleFilterClick} value="nouns">
          Nouns
        </Button>
      </div>
      <div>
        <Button onClick={handleFilterClick} value="verbs">
          Verbs
        </Button>
      </div>
    </div>
  );
};

const SidePanel = () => {
  return (
    <div className={styles.panelContainer}>
      <MatchConfig />
      <FilterContainer />
    </div>
  );
};

export default SidePanel;
