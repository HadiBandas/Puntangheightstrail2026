import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../constants/translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string, options?: { [key: string]: string | number }) => {
    const keys = key.split('.');
    let result: any = translations;

    for (const k of keys) {
      result = result[k];
      if (result === undefined) {
        return key; // Return the key itself if not found
      }
    }

    let translation = result[language] || result['en'];

    if (options) {
        Object.keys(options).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, options[placeholder]);
        });
    }

    return translation;
  };

  return { t, language };
};
