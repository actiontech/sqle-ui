import { Button, Form, Input, Select, Space, Switch } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SQLE_INSTANCE_SOURCE_NAME,
  PageFormLayout,
} from '../../../data/common';
import useRuleTemplate from '../../../hooks/useRuleTemplate';
import { nameRule } from '../../../utils/FormRule';
import DatabaseFormItem from './DatabaseFormItem';
import { IDataSourceFormProps } from './index.type';
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
import IconTipsLabel from '../../../components/IconTipsLabel';
import FooterButtonWrapper from '../../../components/FooterButtonWrapper';

const DataSourceForm: React.FC<IDataSourceFormProps> = (props) => {
  const { t } = useTranslation();
  const isUpdate = React.useMemo<boolean>(
    () => !!props.defaultData,
    [props.defaultData]
  );
  const isExternalInstance = React.useMemo<boolean>(() => {
    if (!props.defaultData) {
      return false;
    }
    return props.defaultData.source !== SQLE_INSTANCE_SOURCE_NAME;
  }, [props.defaultData]);

  const [auditEnabled, setAuditEnabled] = React.useState<boolean>(false);
  const [databaseType, setDatabaseType] = React.useState<string>('');
  const { updateRuleTemplateList, ruleTemplateList } = useRuleTemplate();
  const { updateGlobalRuleTemplateList, globalRuleTemplateList } =
    useGlobalRuleTemplate();
  const databaseTypeChange = useCallback(
    (value: string) => {
      setDatabaseType(value);
      props.form.setFields([
        {
          name: 'ruleTemplate',
          value: undefined,
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
        needAuditForSqlQuery:
          !!props.defaultData.sql_query_config?.audit_enabled,
        allowQueryWhenLessThanAuditLevel: props.defaultData.sql_query_config
          ?.allow_query_when_less_than_audit_level as
          | SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum
          | undefined,
      });
      setDatabaseType(props.defaultData.db_type ?? '');
      setAuditEnabled(!!props.defaultData.sql_query_config?.audit_enabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultData]);

  const { data: instanceMetas } = useRequest(() =>
    instance.getInstanceAdditionalMetas().then((res) => res.data?.data ?? [])
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
    setAuditEnabled(false);
    setDatabaseType('');
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
    setAuditEnabled(check);
    if (!check) {
      props.form.setFieldsValue({
        allowQueryWhenLessThanAuditLevel: undefined,
      });
    } else {
      if (props.defaultData) {
        props.form.setFieldsValue({
          allowQueryWhenLessThanAuditLevel: props.defaultData.sql_query_config
            ?.allow_query_when_less_than_audit_level as
            | SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum
            | undefined,
        });
      }
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
          disabled={isExternalInstance}
          placeholder={t('common.form.placeholder.input', {
            name: t('dataSource.dataSourceForm.describe'),
          })}
        />
      </Form.Item>
      <DatabaseFormItem
        isUpdate={isUpdate}
        isExternalInstance={isExternalInstance}
        form={props.form}
        currentAsyncParams={params}
        databaseTypeChange={databaseTypeChange}
      />
      <Form.Item
        name="maintenanceTime"
        label={
          <IconTipsLabel
            tips={t('dataSource.dataSourceForm.maintenanceTimeTips')}
          >
            {t('dataSource.dataSourceForm.maintenanceTime')}
          </IconTipsLabel>
        }
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
            .filter((v) => (databaseType ? v.db_type === databaseType : true))
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
        label={t('dataSource.dataSourceForm.needAuditForSqlQuery')}
        name="needAuditForSqlQuery"
        valuePropName="checked"
      >
        <Switch checked={auditEnabled} onChange={changeAuditEnabled} />
      </Form.Item>
      <Form.Item
        hidden={!auditEnabled}
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
      <FooterButtonWrapper>
        <EmptyBox if={!isUpdate}>
          <Button onClick={reset}>{t('common.reset')}</Button>
        </EmptyBox>
        <Button type="primary" onClick={submit} loading={loading}>
          {t('common.submit')}
        </Button>
      </FooterButtonWrapper>
    </Form>
  );
};

export default DataSourceForm;
