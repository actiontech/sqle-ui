import React from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useKeyPress } from 'ahooks';

import user from '../../../../api/user';

import { emailValidate } from '../../../../utils/Common';
import { ResponseCode } from '../../../../data/common';

import { UseInputChangeParams } from '../index.type';

const useInputChange = (params: UseInputChangeParams) => {
  const { t } = useTranslation();

  const updateEmail = React.useCallback(
    async (event: KeyboardEvent) => {
      const email = (event.target as HTMLInputElement).value;
      if (email !== '') {
        if (!emailValidate(email)) {
          message.error(t('account.emailErrorMessage.type'));
          return;
        }
        if (email === params.userInfo?.email) {
          message.error(t('account.emailErrorMessage.match'));
          return;
        }
      }
      const res = await user.updateCurrentUserV1({
        email,
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(t('account.updateEmailSuccess'));
        params.refreshUserInfo();
      }
      params.closeEditEmail();
    },
    [params, t]
  );

  const cancelEdit = React.useCallback(() => {
    params.closeEditEmail();
  }, [params]);

  const inputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      params.setInputValue(event.target.value);
    },
    [params]
  );

  useKeyPress('esc', cancelEdit, {
    target: () => document.getElementById('emailInput'),
  });

  useKeyPress('enter', updateEmail, {
    target: () => document.getElementById('emailInput'),
  });

  return { inputChange, cancelEdit };
};

export default useInputChange;
