'use client';
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { TwoLabelToggleSwitch } from '@/app/components/widgets/ToggleSwitch';
import { usePathname, useRouter } from 'next/navigation'; // or 'next/router' for older apps

const getPathname = (pathWithLocale: string) => {
  console.log(pathWithLocale.replace(/^\/[^/]+/, ''));
  return pathWithLocale.replace(/^\/[^/]+/, '');
};

const LangArea: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('LangArea');
  const [options, setOptions] = React.useState({
    en: 'English',
    ru: 'Russian',
  });
  const [lang, setLang] = React.useState(locale);
  const hasMounted = React.useRef(false);
  const pathname = getPathname(usePathname());

  const onLangChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLang((prevLang) => (prevLang === 'en' ? 'ru' : 'en'));
  };

  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    console.log(`this /${lang}${pathname}`);
    router.push(`/${lang}${pathname}`);
    setOptions({ en: t('english'), ru: t('russian') });
  }, [lang]);

  React;

  return (
    <div className="w-[16.67vw]">
      <p>{t('language')}</p>
      <TwoLabelToggleSwitch
        value={lang || 'en'}
        isChecked={lang !== 'en'}
        onSwitchChange={(event) => onLangChange(event)}
        leftLabel={options['en']}
        rightLabel={options['ru']}
      />
    </div>
  );
};

export default LangArea;
