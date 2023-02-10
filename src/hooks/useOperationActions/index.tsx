import React from 'react';
import { useBoolean } from 'ahooks';
import { IOperationActionList } from '../../api/common';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import OperationRecord from '../../api/OperationRecord';

const useOperationActions = () => {
  const [operationActions, setOperationActions] = React.useState<
    IOperationActionList[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOperationActions = React.useCallback(() => {
    setTrue();
    OperationRecord.getOperationActionList()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setOperationActions(res.data?.data ?? []);
        } else {
          setOperationActions([]);
        }
      })
      .catch(() => {
        setOperationActions([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateOperationActionSelectOption = React.useCallback(() => {
    return operationActions.map((content) => {
      return (
        <Select.Option
          key={content.operation_action}
          value={content.operation_action ?? ''}
        >
          {content.desc}
        </Select.Option>
      );
    });
  }, [operationActions]);

  return {
    operationActions,
    loading,
    updateOperationActions,
    generateOperationActionSelectOption,
  };
};

export default useOperationActions;
