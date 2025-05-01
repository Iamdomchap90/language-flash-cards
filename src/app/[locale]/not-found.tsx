import React from 'react';
import { useTranslations } from 'next-intl';

const NotFound = () => {
  const t = useTranslations('NotFoundPage');
  return (
    <div className="menuContainer flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 header-text">t('title')</h1>
    </div>
  );
};

export default NotFound;
