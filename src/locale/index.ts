import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import StorageKey from '../data/StorageKey';
import LocalStorageWrapper from '../utils/LocalStorageWrapper';
import enUS from './en-US';
import zhCn from './zh-CN';

enum SupportLanguage {
  zhCN = 'zh-CN',
  enUS = 'en-US',
}

i18n.use(initReactI18next).init({
  resources: {
    [SupportLanguage.zhCN]: zhCn,
    [SupportLanguage.enUS]: enUS,
  },
  lng: LocalStorageWrapper.getOrDefault(
    StorageKey.Language,
    SupportLanguage.zhCN
  ),
  fallbackLng: SupportLanguage.zhCN,
  interpolation: {
    escapeValue: false,
  },
});

export { SupportLanguage };
export default i18n;
