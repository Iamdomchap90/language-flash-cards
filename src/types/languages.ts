const LANGUAGES = {
  en: 'English',
  ru: 'Russian',
} as const;

type LangCode = keyof typeof LANGUAGES;

export default LangCode;
