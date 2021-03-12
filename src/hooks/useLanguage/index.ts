import React from 'react';
import { useTranslation } from 'react-i18next';
import { SupportLanguage } from '../../locale';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import en from 'antd/lib/locale/en_US';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import { updateLanguage } from '../../store/locale';
import { ReactComponent as zhCNSvg } from '../../assets/img/zh-cn.svg';
import { ReactComponent as enUSSvg } from '../../assets/img/en-us.svg';

const languageData = {
  [SupportLanguage.zhCN]: {
    moment: 'zh-cn',
    antd: zhCN,
    label: '中文',
    icon: zhCNSvg,
  },
  [SupportLanguage.enUS]: {
    moment: 'en-gb',
    antd: en,
    label: 'English',
    icon: enUSSvg,
  },
};

const assertLanguage = (language: string): language is SupportLanguage => {
  return language in languageData;
};

const useLanguage = () => {
  const language = useSelector<IReduxState, string>(
    (state) => state.locale.language
  );
  const { i18n } = useTranslation();

  const antdLocale = React.useMemo(() => {
    let currentLanguage = SupportLanguage.zhCN;
    if (assertLanguage(language)) {
      currentLanguage = language;
    }
    return languageData[currentLanguage].antd;
  }, [language]);

  React.useEffect(() => {
    if (!assertLanguage(language)) {
      updateLanguage({ language: SupportLanguage.zhCN });
      return;
    }
    i18n.changeLanguage(language);
    moment.locale(languageData[language].moment);
  }, [language, i18n]);

  return {
    antdLocale,
  };
};

export { languageData };
export default useLanguage;
