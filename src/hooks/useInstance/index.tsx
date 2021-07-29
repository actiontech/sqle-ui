import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import React from 'react';
import { IInstanceTipResV1 } from '../../api/common';
import instance from '../../api/instance';
import { ResponseCode } from '../../data/common';

const useInstance = () => {
  const [instanceList, setInstanceList] = React.useState<IInstanceTipResV1[]>(
    []
  );
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateInstanceList = React.useCallback(() => {
    setTrue();
    instance
      .getInstanceTipListV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setInstanceList(res.data?.data ?? []);
        } else {
          setInstanceList([]);
        }
      })
      .catch(() => {
        setInstanceList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateInstanceSelectOption = React.useCallback(
    (instance_type: string = 'mysql') => {
      return instanceList
        .filter((i) => i.instance_type === instance_type)
        .map((instance) => {
          return (
            <Select.Option
              key={instance.instance_name}
              value={instance.instance_name ?? ''}
            >
              {instance.instance_name}
            </Select.Option>
          );
        });
    },
    [instanceList]
  );

  return {
    instanceList,
    loading,
    updateInstanceList,
    generateInstanceSelectOption,
  };
};

export default useInstance;
