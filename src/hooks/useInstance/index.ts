import { useBoolean } from 'ahooks';
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

  return {
    instanceList,
    loading,
    updateInstanceList,
  };
};

export default useInstance;
