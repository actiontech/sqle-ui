import { Form, Select } from 'antd';
import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSourceProps } from '.';
import instance from '../../../../api/instance';
import { IGetInstanceTipListV1Params } from '../../../../api/instance/index.d';
import { getInstanceTipListV1FunctionalModuleEnum } from '../../../../api/instance/index.enum';
import { ResponseCode } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import useInstance from '../../../../hooks/useInstance';
import useInstanceSchema from '../../../../hooks/useInstanceSchema';
import EventEmitter from '../../../../utils/EventEmitter';

const DataSource: React.FC<DataSourceProps> = (props) => {
  const { form, defaultValue, dataSource, projectName } = props;

  const { t } = useTranslation();

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
  const { generateInstanceSchemaSelectOption } = useInstanceSchema(
    projectName,
    dataSource
  );

  const handleDataSourceChange = (dataSource: string) => {
    props.dataSourceChange?.(dataSource);
    form.setFieldsValue({
      schema: undefined,
    });
    if (!!dataSource) {
      instance
        .getInstanceV1({
          instance_name: dataSource,
          project_name: projectName,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            form.setFieldsValue({
              dbType: res.data.data?.db_type,
            });
            handleDbTypeChange(res.data.data?.db_type ?? '');
          }
        });
    }
  };

  const handleDbTypeChange = (dbType: string, resetDataSource = false) => {
    if (resetDataSource) {
      props.dataSourceChange?.('');
      form.setFieldsValue({
        databaseName: '',
      });
    }
    props.dbTypeChange?.(dbType);
    updateInstanceList({ ...getInstanceParams, filter_db_type: dbType });
  };

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  useEffect(() => {
    const refreshInstanceList = () => {
      updateInstanceList(getInstanceParams);
    };

    refreshInstanceList();

    EventEmitter.subscribe(
      EmitterKey.Reset_Audit_Plan_Form_Instance_List,
      refreshInstanceList
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Audit_Plan_Form_Instance_List,
        refreshInstanceList
      );
    };
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
          disabled={!!defaultValue}
          placeholder={t('common.form.placeholder.select')}
          onChange={(dnType) => handleDbTypeChange(dnType, true)}
          allowClear
        >
          {generateDriverSelectOptions()}
        </Select>
      </Form.Item>
    </>
  );
};

export default DataSource;
