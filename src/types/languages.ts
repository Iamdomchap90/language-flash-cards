const LANGUAGES = {
  en: 'English',
  ru: 'Russian',
} as const;

type LangCode = keyof typeof LANGUAGES;

export const isLangCode = (value: any): value is LangCode => {
  return value in LANGUAGES;
};

export default LangCode;
