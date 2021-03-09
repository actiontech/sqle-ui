import 'react-i18next';

import zhCN from '../locale/zh-CN';
import enUS from '../locale/en-US';

declare module 'react-i18next' {
  interface Resources {
    'zh-CN': typeof zhCN.translation;
    'en-US': typeof enUS.translation;
  }
}
