import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import StorageKey from '../data/StorageKey';
import { Dictionary, I18nKey } from '../types/common.type';
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

const t = (key: I18nKey, dic?: Dictionary) => {
  return i18n.t(key, dic);
};

export { SupportLanguage, t };
export default i18n;
