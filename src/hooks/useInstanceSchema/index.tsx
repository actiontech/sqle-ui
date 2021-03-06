import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import React from 'react';
import instance from '../../api/instance';
import { ResponseCode } from '../../data/common';

const useInstanceSchema = (instanceName?: string) => {
  const [schemaList, setSchemaList] = React.useState<string[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateSchemaList = React.useCallback(() => {
    if (!instanceName) {
      setSchemaList([]);
      return;
    }
    setTrue();
    instance
      .getInstanceSchemasV1({
        instance_name: instanceName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSchemaList(res.data.data?.schema_name_list ?? []);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [instanceName, setFalse, setTrue]);

  const generateInstanceSchemaSelectOption = React.useCallback(() => {
    return schemaList.map((schema) => (
      <Select.Option value={schema} key={schema}>
        {schema}
      </Select.Option>
    ));
  }, [schemaList]);

  React.useEffect(() => {
    updateSchemaList();
  }, [instanceName, updateSchemaList]);

  return {
    schemaList,
    loading,
    updateSchemaList,
    generateInstanceSchemaSelectOption,
  };
};

export default useInstanceSchema;
