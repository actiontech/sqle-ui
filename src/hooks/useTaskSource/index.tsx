import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import React from 'react';
import { ISyncTaskTipsResV1 } from '../../api/common';
import sync_instance from '../../api/sync_instance';
import { ResponseCode } from '../../data/common';

const useTaskSource = () => {
  const [taskSourceList, setTaskSourceList] = React.useState<
    ISyncTaskTipsResV1[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateTaskSourceList = React.useCallback(() => {
    setTrue();
    sync_instance
      .GetSyncTaskSourceTips()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setTaskSourceList(res.data?.data ?? []);
        } else {
          setTaskSourceList([]);
        }
      })
      .catch(() => {
        setTaskSourceList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateTaskSourceSelectOption = React.useCallback(() => {
    return taskSourceList.map((source) => {
      return (
        <Select.Option key={source.source} value={source.source ?? ''}>
          {source.source}
        </Select.Option>
      );
    });
  }, [taskSourceList]);

  const generateTaskSourceDbTypesSelectOption = React.useCallback(
    (source: string) => {
      const dbTypes =
        taskSourceList.find((v) => v.source === source)?.db_types ?? [];
      return dbTypes.map((type) => {
        return (
          <Select.Option key={type} value={type ?? ''}>
            {type}
          </Select.Option>
        );
      });
    },
    [taskSourceList]
  );

  return {
    taskSourceList,
    loading,
    updateTaskSourceList,
    generateTaskSourceSelectOption,
    generateTaskSourceDbTypesSelectOption,
  };
};

export default useTaskSource;
