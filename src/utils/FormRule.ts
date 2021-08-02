import { Rule } from 'rc-field-form/lib/interface';
import { translation } from '../locale';
import { FormValidatorRule } from '../types/common.type';

export const nameRule = (): Rule[] => {
  return [
    {
      validator: nameRuleValidator(),
    },
    {
      max: 59,
    },
  ];
};

export const nameRuleValidator = (): FormValidatorRule => {
  return (_, value) => {
    const startReg = /^[a-zA-Z]/;
    if (!startReg.test(value)) {
      return Promise.reject(translation('common.form.rule.startWithLetter'));
    }
    const reg = /^[a-zA-Z0-9_-]*$/;
    if (!reg.test(value)) {
      return Promise.reject(
        translation('common.form.rule.onlyLetterAndNumber')
      );
    }
    return Promise.resolve();
  };
};

export const whiteSpaceSql = (): Rule[] => {
  return [
    {
      validator: whiteSpaceSqlValidator(),
    },
  ];
};

export const whiteSpaceSqlValidator = (): FormValidatorRule => {
  return (_, values) => {
    const placeholder = '/* input your sql */';
    if (values === placeholder) {
      return Promise.reject(
        translation('common.form.rule.require', {
          name: translation('whitelist.table.sql'),
        })
      );
    }
    return Promise.resolve();
  };
};
