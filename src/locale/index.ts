import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import StorageKey from '../data/StorageKey';
import { Dictionary, I18nKey } from '../types/common.type';
import LocalStorageWrapper from '../utils/LocalStorageWrapper';
import enUS from './en-US';
import zhCN from './zh-CN';

enum SupportLanguage {
  zhCN = 'zh-CN',
  enUS = 'en-US',
}

i18n.use(initReactI18next).init({
  resources: {
    [SupportLanguage.zhCN]: zhCN,
    [SupportLanguage.enUS]: enUS,
  },
  lng: LocalStorageWrapper.getOrDefault(
    StorageKey.Language,
    SupportLanguage.zhCN
  ),
  fallbackLng: SupportLanguage.zhCN,
  interpolation: {
    escapeValue: false,
    /*
     * 避免语言包存在插值但是在没有传递值的情况下渲染出原始内容
     * example:
     *  {
     *    key: ‘请输入 {{name}}’
     *  }
     *  t('key')
     *  1. skipOnVariables 为 true 时: 请输入 {{name}}
     *  2. skipOnVariables 为 false 时: 请输入
     */
    skipOnVariables: false,
  },
});

const t = (key: I18nKey, dic?: Dictionary) => {
  return i18n.t(key, dic);
};

export { SupportLanguage, t };
export default i18n;
