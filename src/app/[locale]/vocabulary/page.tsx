'use client';
import React, { useState, useEffect, useCallback } from 'react';
import FlashBoard from '@/app/components/flash-cards/Flashcard';
import SidePanel from '@/app/components/side-panel/SidePanel';
import styles from './page.module.css';
import AuthArea from '@/app/components/auth-area/AuthArea';
import LangArea from '@/app/components/lang-setting-area/LangArea';
import { VocabCardDocument } from '@/types/models';
import { useTranslations } from 'next-intl';
import LangCode from '@/types/languages';
import { TwoLabelToggleSwitch } from '@/app/components/widgets/ToggleSwitch';

const Vocabulary: React.FC = () => {
  const [data, setData] = useState<VocabCardDocument[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(
    null
  );
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [wordCategory, setWordCategory] = useState<string | null>(null);
  const [displayLang, setDisplayLang] = useState<LangCode>('en');
  const [options, setOptions] = React.useState({
    en: 'English',
    ru: 'Russian',
  });

  const t = useTranslations('VocabPage');
  const te = useTranslations('errors');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const fetchData = useCallback(
    async (
      lexicalCategory: string | null = null,
      buttonIndex: number | null = null
    ): Promise<void> => {
      setIsLoading(true);
      setIsError(false);

      try {
        const lexicalCategoryParameter = lexicalCategory
          ? `?wordType=${lexicalCategory}`
          : '';
        const response = await fetch(
          '/api/vocab-cards' + lexicalCategoryParameter
        );

        if (!response.ok) {
          let errorResponse = await response.json();
          throw new Error(errorResponse.error || te('fetchData'));
        }

        const result = await response.json();
        setData(result);
        setActiveButtonIndex(buttonIndex);
        setWordCategory(lexicalCategory);
      } catch (error) {
        setIsError(true);
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, [displayLang]);

  const onLangChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayLang((prevLang) => (prevLang === 'en' ? 'ru' : 'en'));
  };

  const handleNextCards = () => {};

  if (!hasMounted) {
    return <p>Loading...</p>; // Prevents rendering mismatched content
  }

  if (isLoading) {
    return <p>Loading vocabulary...</p>;
  }

  if (isError) {
    return <p>{te('unexpected')}...</p>;
  }

  return (
    <>
      <div className={`${styles.headContainer}`}>
        <h1 className="header-text">{t('title')}</h1>
        <AuthArea />
        <LangArea />
      </div>
      <div className={styles.boardContainer}>
        <TwoLabelToggleSwitch
          value={displayLang || 'en'}
          isChecked={displayLang !== 'en'}
          onSwitchChange={(event) => onLangChange(event)}
          leftLabel={options['en']}
          rightLabel={options['ru']}
        />
        <FlashBoard
          data={data}
          updateNewCards={fetchData}
          activeButtonIndex={activeButtonIndex}
          boardLang={displayLang}
          wordType={wordCategory}
        />
      </div>
      <SidePanel filterCards={fetchData} activeIndex={activeButtonIndex} />
    </>
  );
};

export default Vocabulary;
