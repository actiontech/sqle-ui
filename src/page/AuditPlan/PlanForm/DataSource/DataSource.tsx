import { Form, Select } from 'antd';
import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSourceProps } from '.';
import instance from '../../../../api/instance';
import { IGetInstanceTipListV1Params } from '../../../../api/instance/index.d';
import { getInstanceTipListV1FunctionalModuleEnum } from '../../../../api/instance/index.enum';
import { ResponseCode } from '../../../../data/common';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import useInstance from '../../../../hooks/useInstance';
import useInstanceSchema from '../../../../hooks/useInstanceSchema';
import { useCurrentProjectName } from '../../../ProjectManage/ProjectDetail';

const DataSource: React.FC<DataSourceProps> = (props) => {
  const { form, defaultValue, dataSource } = props;

  const { t } = useTranslation();
  const { projectName } = useCurrentProjectName();

  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();

  const getInstanceParams = useMemo<IGetInstanceTipListV1Params>(() => {
    const params: IGetInstanceTipListV1Params = {
      project_name: projectName,
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_audit_plan,
    };
    if (!!defaultValue) {
      params.filter_db_type = defaultValue.audit_plan_db_type;
    }
    return params;
  }, [defaultValue, projectName]);

  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { generateInstanceSchemaSelectOption } = useInstanceSchema(dataSource);

  const handleDataSourceChange = (dataSource: string) => {
    props.dataSourceChange?.(dataSource);
    form.setFieldsValue({
      schema: undefined,
    });
    if (!!dataSource) {
      instance
        .getInstanceV1({ instance_name: dataSource, project_name: projectName })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            form.setFieldsValue({
              dbType: res.data.data?.db_type,
            });
            props.dbTypeChange?.(res.data.data?.db_type ?? '');
          }
        });
    }
  };

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  useEffect(() => {
    updateInstanceList(getInstanceParams);
  }, [getInstanceParams, updateInstanceList]);

  return (
    <>
      <Form.Item
        label={t('auditPlan.planForm.databaseName')}
        name="databaseName"
        tooltip={t('auditPlan.planForm.databaseNameTips')}
      >
        <Select
          allowClear
          showSearch
          onChange={handleDataSourceChange}
          placeholder={t('common.form.placeholder.select')}
        >
          {generateInstanceSelectOption()}
        </Select>
      </Form.Item>
      <Form.Item label={t('auditPlan.planForm.schema')} name="schema">
        <Select allowClear placeholder={t('common.form.placeholder.select')}>
          {generateInstanceSchemaSelectOption()}
        </Select>
      </Form.Item>
      <Form.Item
        label={t('auditPlan.planForm.dbType')}
        name="dbType"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select<string>
          disabled={!!dataSource || !!defaultValue}
          placeholder={t('common.form.placeholder.select')}
          onChange={props.dbTypeChange}
        >
          {generateDriverSelectOptions()}
        </Select>
      </Form.Item>
    </>
  );
};

export default DataSource;
