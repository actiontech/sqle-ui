import { I18nKey } from '../../types/common.type';

export type StaticEnumDictionary<T extends string> = {
  [key in T]: I18nKey;
};
