'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import ToggleSwitch from '@/app/components/widgets/ToggleSwitch';
import { FilterCardsCallbackType } from '@/types/callbacks';
import { useTranslations } from 'next-intl';

type FilterContainerProps = {
  filterCards: FilterCardsCallbackType;
  activeIndex: number | null;
};

const MatchConfig = () => {
  // Radio select for text entry, multiple choice
  const t = useTranslations('MatchConfig');
  const [selectedConfig, setSelectedConfig] = useState<string>('text'); // Default selected Config

  const handleConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedConfig(event.target.value);
  };

  useEffect(() => {}, [selectedConfig]);

  return (
    <div className={styles.configContainer}>
      <div>
        <h2 className="long-text">{t('input')}</h2>
      </div>
      <div>
        <ToggleSwitch
          value={'text'}
          isChecked={selectedConfig === 'text'}
          onConfigChange={handleConfigChange}
        >
          {t('text')}
        </ToggleSwitch>
      </div>
      <div>
        <ToggleSwitch
          value="multipleChoice"
          isChecked={selectedConfig === 'multipleChoice'}
          onConfigChange={handleConfigChange}
        >
          {t('multipleChoice')}
        </ToggleSwitch>
      </div>
    </div>
  );
};

const FilterContainer: React.FC<FilterContainerProps> = ({
  filterCards,
  activeIndex,
}) => {
  // Radio select for verbs, nouns, adjectives, adverbs
  const t = useTranslations('FilterContainer');
  const handleFilterClick = (buttonIndex: number | null, wordType: string) => {
    filterCards(wordType, buttonIndex);
  };

  return (
    <div className={styles.configContainer}>
      <div>
        <h2 className="long-text">{t('vocabularyFilter')}</h2>
      </div>
      <div>
        <button
          className={activeIndex === 0 ? 'btn activeBtn' : 'btn'}
          onClick={() => handleFilterClick(0, 'noun')}
        >
          {t('nouns')}
        </button>
      </div>
      <div>
        <button
          className={activeIndex === 1 ? 'btn activeBtn' : 'btn'}
          onClick={() => handleFilterClick(1, 'verb')}
        >
          {t('verbs')}
        </button>
      </div>
      <div>
        <button
          className={activeIndex === 2 ? 'btn activeBtn' : 'btn'}
          onClick={() => handleFilterClick(2, 'adjective')}
        >
          {t('adjectives')}
        </button>
      </div>
      <div>
        <button
          className={activeIndex === 3 ? 'btn activeBtn' : 'btn'}
          onClick={() => handleFilterClick(3, 'adverb')}
        >
          {t('adverbs')}
        </button>
      </div>
    </div>
  );
};

const SidePanel: React.FC<FilterContainerProps> = ({
  filterCards,
  activeIndex,
}) => {
  return (
    <div className={styles.panelContainer}>
      <MatchConfig />
      <FilterContainer filterCards={filterCards} activeIndex={activeIndex} />
    </div>
  );
};

export default SidePanel;
