import React from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import configurationService from '../../api/configuration';
import { Select } from 'antd';
import { IDriverMeta } from '../../api/common';
import DatabaseTypeLogo from '../../components/DatabaseTypeLogo';

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
    return driverMeta.map((v) => {
      return (
        <Select.Option key={v.driver_name} value={v.driver_name}>
          <DatabaseTypeLogo dbType={v.driver_name ?? ''} logoUrl={v.logo_url} />
        </Select.Option>
      );
    });
  }, [driverMeta]);

  return {
    driverNameList,
    loading,
    updateDriverNameList,
    generateDriverSelectOptions,
    driverMeta,
  };
};
export default useDatabaseType;
