import React from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import configurationService from '../../api/configuration';
import { Select } from 'antd';
import { IDriverMeta } from '../../api/common';

const useDatabaseType = () => {
  const [driverNameList, setDriverNameList] = React.useState<string[]>([]);
  const [driverMeta, setDriverMeta] = React.useState<IDriverMeta[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const updateDriverNameList = React.useCallback(() => {
    setTrue();
    configurationService
      .getDriversV2()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setDriverMeta(res.data.data ?? []);
          setDriverNameList(
            res.data.data?.map((v) => v.driver_name ?? '') ?? []
          );
        } else {
          setDriverNameList([]);
          setDriverMeta([]);
        }
      })
      .catch(() => {
        setDriverMeta([]);
        setDriverNameList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateDriverSelectOptions = React.useCallback(() => {
    return driverNameList.map((driver: string) => {
      return (
        <Select.Option key={driver} value={driver}>
          {driver}
        </Select.Option>
      );
    });
  }, [driverNameList]);

  return {
    driverNameList,
    loading,
    updateDriverNameList,
    generateDriverSelectOptions,
    driverMeta,
  };
};
export default useDatabaseType;
