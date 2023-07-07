import { useBoolean, useToggle } from 'ahooks';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import { ResponseCode } from '../../../../data/common';

const usePanelCommonRequest = <
  T extends {
    code?: number;
    message?: string;
  }
>(
  server: () => Promise<AxiosResponse<T>>,
  { onSuccess }: { onSuccess: (res: AxiosResponse<T>) => void }
) => {
  const { t } = useTranslation();
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);
  const [errorMessage, setErrorMessage] = useState('');

  const globalRefresh = useSelector((state: IReduxState) => {
    return state.projectManage.overviewRefreshFlag;
  });

  const [refresh, { toggle: refreshAction }] = useToggle();

  useEffect(() => {
    const getData = () => {
      server()
        .then((res) => {
          startGetData();
          if (res.data.code !== ResponseCode.SUCCESS) {
            setErrorMessage(res.data.message ?? t('common.unknownError'));
          } else {
            setErrorMessage('');
            onSuccess(res);
          }
        })
        .catch((error) => {
          setErrorMessage(error?.toString() ?? t('common.unknownError'));
          finishGetData();
        })
        .finally(() => {
          finishGetData();
        });
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalRefresh, refresh]);

  return {
    loading,
    errorMessage,
    refreshAction,
  };
};
export default usePanelCommonRequest;
