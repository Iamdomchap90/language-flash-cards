import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Menu() {
  const t = useTranslations('HomePage');
  return (
    <div className="menuContainer flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 header-text">{t('title')}</h1>
      <p className="text-centre long-text mb-8">{t('tagline')}</p>
      <div className="w-[300px] flex justify-between">
        <Link
          href="/vocabulary/"
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
        >
          {t('vocabOption')}
        </Link>
        <Link
          href="/statistics/"
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
        >
          {t('statOption')}
        </Link>
      </div>
    </div>
  );
}
