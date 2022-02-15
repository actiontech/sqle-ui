import { useCallback, useState } from 'react';
import { useBoolean } from 'ahooks';
import { IOperationResV1 } from '../../api/common';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import operation from '../../api/operation';

const useOperation = () => {
  const [operationList, setOperationList] = useState<IOperationResV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOperationList = useCallback(() => {
    setTrue();
    operation
      .GetOperationsV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setOperationList(res.data?.data ?? []);
        } else {
          setOperationList([]);
        }
      })
      .catch(() => {
        setOperationList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateOperationSelectOption = useCallback(() => {
    return operationList.map((operation) => {
      return (
        <Select.Option key={operation.op_code} value={operation.op_code ?? ''}>
          {operation.op_desc}
        </Select.Option>
      );
    });
  }, [operationList]);

  return {
    operationList,
    loading,
    updateOperationList,
    generateOperationSelectOption,
  };
};

export default useOperation;
