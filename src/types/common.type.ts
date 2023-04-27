import { ColumnGroupType, ColumnType, TableProps } from 'antd/lib/table';
import { ValidatorRule } from 'rc-field-form/lib/interface';
import zhCN from '../locale/zh-CN';
import { Theme } from '@mui/material/styles';

export type Dictionary = {
  [key: string]: string | number | boolean | Dictionary | string[] | undefined;
};

export type StringDictionary = {
  [key: string]: string;
};

export type ModalStatus = {
  [key: string]: boolean;
};

export type TableColumn<RecordType = unknown, OtherColumnKes = ''> = Array<
  | (ColumnGroupType<RecordType> | ColumnType<RecordType>) & {
      dataIndex: keyof RecordType | OtherColumnKes;
    }
>;

export type TableChange<RecordType = unknown> = Required<
  TableProps<RecordType>
>['onChange'];

type TemplateKeyPath<T> = {
  [key in keyof T]: key extends string
    ? T[key] extends Record<string, any>
      ? `${key}.${TemplateKeyPath<T[key]>}`
      : key
    : never;
}[keyof T];

export type I18nKey = TemplateKeyPath<typeof zhCN.translation>;

export type FormValidatorRule = ValidatorRule['validator'];

declare module '@mui/material/styles' {
  interface ThemeOptions {
    common: {
      padding: number;
      color: {
        warning: string;
        disabledFont: string;
      };
    };
    header: {
      background: string;
      color: string;
    };
    editor: {
      border: string;
    };
    projectLayoutSider: {
      border: string;
    };
    optionsHover: {
      background: string;
    };
  }

  interface Theme extends ThemeOptions {
    noUse: string;
  }
  // 允许配置文件使用 `createTheme`
  interface DeprecatedThemeOptions extends Partial<ThemeOptions> {
    noUse?: string;
  }
}

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}
