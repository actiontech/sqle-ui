import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './en-US';
import zhCn from './zh-CN';

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': zhCn,
    'en-US': enUS,
  },
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
