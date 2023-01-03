import { Button, Form, Input, InputNumber, Select, Space, Switch } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageFormLayout } from '../../../data/common';
import useRuleTemplate from '../../../hooks/useRuleTemplate';
import { nameRule } from '../../../utils/FormRule';
import DatabaseFormItem from './DatabaseFormItem';
import { IDataSourceFormProps } from './index.type';
import { ruleTemplateListDefaultKey } from '../../../data/common';
import useAsyncParams from '../../../components/BackendForm/useAsyncParams';
import { useBoolean, useRequest } from 'ahooks';
import EmptyBox from '../../../components/EmptyBox';
import instance from '../../../api/instance';
import { FormItem } from '../../../components/BackendForm';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { turnDataSourceAsyncFormToCommon } from '../tool';
import MaintenanceTimePicker from './MaintenanceTimePicker';
import {
  SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum,
  SQLQueryConfigResV1AllowQueryWhenLessThanAuditLevelEnum,
} from '../../../api/common.enum';
import useGlobalRuleTemplate from '../../../hooks/useGlobalRuleTemplate';

const DataSourceForm: React.FC<IDataSourceFormProps> = (props) => {
  const { t } = useTranslation();
  const isUpdate = React.useMemo<boolean>(
    () => !!props.defaultData,
    [props.defaultData]
  );
  const [databaseType, setDatabaseType] = React.useState<string>(
    ruleTemplateListDefaultKey
  );
  const { updateRuleTemplateList, ruleTemplateList } = useRuleTemplate();
  const { updateGlobalRuleTemplateList, globalRuleTemplateList } =
    useGlobalRuleTemplate();
  const databaseTypeChange = useCallback(
    (value) => {
      setDatabaseType(value ?? ruleTemplateListDefaultKey);
      props.form.setFields([
        {
          name: 'ruleTemplate',
          value: null,
        },
      ]);
    },
    [props.form]
  );

  const { generateFormValueByParams, mergeFromValueIntoParams } =
    useAsyncParams();

  React.useEffect(() => {
    updateRuleTemplateList(props.projectName);
    updateGlobalRuleTemplateList();
  }, [updateRuleTemplateList, props.projectName, updateGlobalRuleTemplateList]);

  React.useEffect(() => {
    if (!!props.defaultData) {
      props.form.setFieldsValue({
        name: props.defaultData.instance_name,
        describe: props.defaultData.desc,
        type: props.defaultData.db_type,
        ip: props.defaultData.db_host,
        port: Number.parseInt(props.defaultData.db_port ?? ''),
        user: props.defaultData.db_user,
        ruleTemplate: props.defaultData.rule_template_name,
        params: generateFormValueByParams(
          turnDataSourceAsyncFormToCommon(
            props.defaultData.additional_params ?? []
          )
        ),
        maintenanceTime: props.defaultData.maintenance_times?.map((item) => ({
          startTime: item.maintenance_start_time,
          endTime: item.maintenance_stop_time,
        })),
        maxPreQueryRows:
          props.defaultData.sql_query_config?.max_pre_query_rows ?? 100,
        queryTimeoutSecond:
          props.defaultData.sql_query_config?.query_timeout_second,
        needAuditForSqlQuery:
          !!props.defaultData.sql_query_config?.audit_enabled,
        allowQueryWhenLessThanAuditLevel: props.defaultData.sql_query_config
          ?.allow_query_when_less_than_audit_level as
          | SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum
          | undefined,
      });
      setDatabaseType(props.defaultData.db_type ?? ruleTemplateListDefaultKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultData]);

  const { data: instanceMetas } = useRequest(
    () => instance.getInstanceAdditionalMetas(),
    {
      formatResult(res) {
        return res.data?.data ?? [];
      },
    }
  );

  const params = useMemo<FormItem[]>(() => {
    if (!instanceMetas || !databaseType) {
      return [];
    }
    const temp = instanceMetas.find((item) => item.db_type === databaseType);
    if (!temp) {
      return [];
    }
    return turnDataSourceAsyncFormToCommon(temp.params ?? []);
  }, [databaseType, instanceMetas]);

  useEffect(() => {
    if (params.length > 0 && !props.defaultData) {
      props.form.setFieldsValue({
        params: generateFormValueByParams(params),
      });
    }
  }, [generateFormValueByParams, params, props.defaultData, props.form]);

  const [loading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const reset = () => {
    EventEmitter.emit(EmitterKey.Reset_Test_Data_Source_Connect);
    props.form.resetFields();
  };

  const submit = async () => {
    const values = await props.form.validateFields();
    startSubmit();
    if (values.params) {
      values.asyncParams = mergeFromValueIntoParams(values.params, params);
      delete values.params;
    }
    props.submit?.(values).finally(() => {
      submitFinish();
    });
  };

  const changeAuditEnabled = (check: boolean) => {
    if (check) {
      props.form.setFieldsValue({
        allowQueryWhenLessThanAuditLevel:
          SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum.error,
      });
    } else {
      props.form.setFieldsValue({
        allowQueryWhenLessThanAuditLevel: undefined,
      });
    }
  };

  return (
    <Form form={props.form} {...PageFormLayout}>
      <Form.Item
        label={t('dataSource.dataSourceForm.name')}
        name="name"
        validateFirst={true}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dataSource.dataSourceForm.name'),
            }),
          },
          ...nameRule(),
        ]}
      >
        <Input
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('dataSource.dataSourceForm.name'),
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.describe')}
        name="describe"
      >
        <Input.TextArea
          placeholder={t('common.form.placeholder.input', {
            name: t('dataSource.dataSourceForm.describe'),
          })}
        />
      </Form.Item>
      <DatabaseFormItem
        isUpdate={isUpdate}
        form={props.form}
        currentAsyncParams={params}
        databaseTypeChange={databaseTypeChange}
      />
      <Form.Item
        name="maintenanceTime"
        label={t('dataSource.dataSourceForm.maintenanceTime')}
      >
        <MaintenanceTimePicker />
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.ruleTemplate')}
        name="ruleTemplate"
        rules={[{ required: true }]}
      >
        <Select
          showSearch
          allowClear
          placeholder={t('common.form.placeholder.select', {
            name: t('dataSource.dataSourceForm.ruleTemplate'),
          })}
        >
          {[...ruleTemplateList, ...globalRuleTemplateList]
            .filter((v) => v.db_type === databaseType)
            .map((template) => {
              return (
                <Select.Option
                  key={template.rule_template_name}
                  value={template.rule_template_name ?? ''}
                >
                  {template.rule_template_name}
                </Select.Option>
              );
            })}
        </Select>
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.maxPreQueryRows')}
        name="maxPreQueryRows"
        initialValue={100}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dataSource.dataSourceForm.maxPreQueryRows'),
            }),
          },
        ]}
      >
        <InputNumber className="full-width-element" />
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.queryTimeoutSecond')}
        name="queryTimeoutSecond"
      >
        <InputNumber className="full-width-element" />
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.needAuditForSqlQuery')}
        name="needAuditForSqlQuery"
        valuePropName="checked"
      >
        <Switch onChange={changeAuditEnabled} />
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel')}
        name="allowQueryWhenLessThanAuditLevel"
      >
        <Select>
          {Object.values(
            SQLQueryConfigResV1AllowQueryWhenLessThanAuditLevelEnum
          ).map((v) => {
            return (
              <Select.Option key={v} value={v}>
                {v}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Space>
          <EmptyBox if={!isUpdate}>
            <Button onClick={reset}>{t('common.reset')}</Button>
          </EmptyBox>
          <Button type="primary" onClick={submit} loading={loading}>
            {t('common.submit')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DataSourceForm;
