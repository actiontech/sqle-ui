import React from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import configurationService from '../../api/configuration';
import { Select } from 'antd';

const useDatabaseType = () => {
  const [driverNameList, setDriverNameList] = React.useState<string[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateDriverNameList = React.useCallback(() => {
    setTrue();
    configurationService
      .getDriversV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setDriverNameList(res.data?.data?.driver_name_list ?? []);
        } else {
          setDriverNameList([]);
        }
      })
      .catch(() => {
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
  };
};
export default useDatabaseType;
