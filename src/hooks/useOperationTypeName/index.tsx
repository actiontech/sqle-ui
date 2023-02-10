import React from 'react';
import { useBoolean } from 'ahooks';
import { IOperationTypeNameList } from '../../api/common';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import OperationRecord from '../../api/OperationRecord';

const useOperationTypeName = () => {
  const [operationTypeNameList, setOperationTypeNameList] = React.useState<
    IOperationTypeNameList[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOperationTypeNameList = React.useCallback(() => {
    setTrue();
    OperationRecord.GetOperationTypeNameList()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setOperationTypeNameList(res.data?.data ?? []);
        } else {
          setOperationTypeNameList([]);
        }
      })
      .catch(() => {
        setOperationTypeNameList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateOperationTypeNameSelectOption = React.useCallback(() => {
    return operationTypeNameList.map((type) => {
      return (
        <Select.Option
          key={type.operation_type_name}
          value={type.operation_type_name ?? ''}
        >
          {type.desc}
        </Select.Option>
      );
    });
  }, [operationTypeNameList]);

  return {
    operationTypeNameList,
    loading,
    updateOperationTypeNameList,
    generateOperationTypeNameSelectOption,
  };
};

export default useOperationTypeName;
