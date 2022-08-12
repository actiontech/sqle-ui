import { useBoolean } from 'ahooks';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResponseCode } from '../../../data/common';
import { IReduxState } from '../../../store';

const usePanelCommonRequest = <
  T extends { code?: number; message?: string; data?: any }
>(
  server: () => Promise<AxiosResponse<T>>,
  formatResult: (res: AxiosResponse<T>) => void,
  manual = false
) => {
  const { t } = useTranslation();
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);
  const [errorMessage, setErrorMessage] = useState('');

  const refreshFlag = useSelector((state: IReduxState) => {
    return state.reportStatistics.refreshFlag;
  });

  const getData = () => {
    server()
      .then((res) => {
        startGetData();
        if (res.data.code !== ResponseCode.SUCCESS) {
          setErrorMessage(res.data.message ?? t('common.unknownError'));
        } else {
          setErrorMessage('');
          formatResult(res);
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

  useEffect(() => {
    if (!manual) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag, manual]);

  return {
    getData,
    loading,
    errorMessage,
  };
};
export default usePanelCommonRequest;
