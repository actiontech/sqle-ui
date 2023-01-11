import { useBoolean } from 'ahooks';
import { Button, Form, Input, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SyncTaskFormFields, SyncTaskFormProps } from '.';
import CronInput from '../../../components/CronInput';
import {
  PageFormLayout,
  ruleTemplateListDefaultKey,
} from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { checkCron } from '../../../hooks/useCron/cron.tool';
import useDatabaseType from '../../../hooks/useDatabaseType';
import useGlobalRuleTemplate from '../../../hooks/useGlobalRuleTemplate';
import useTaskSource from '../../../hooks/useTaskSource';
import EventEmitter from '../../../utils/EventEmitter';

const SyncTaskForm: React.FC<SyncTaskFormProps> = ({
  form,
  submit,
  defaultValue,
}) => {
  const { t } = useTranslation();
  const [dbType, setDbType] = useState('');

  const { updateTaskSourceList, generateTaskSourceSelectOption } =
    useTaskSource();
  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();
  const {
    generateGlobalRuleTemplateSelectOption,
    updateGlobalRuleTemplateList,
  } = useGlobalRuleTemplate();

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const dbTypeChange = (type: string) => {
    setDbType(type);
    form.setFieldsValue({
      ruleTemplateName: undefined,
    });
  };

  const onFinish = (values: SyncTaskFormFields) => {
    startSubmit();

    submit(values).finally(() => {
      submitFinish();
    });
  };

  const resetForm = () => {
    if (!!defaultValue) {
      form.resetFields(['version', 'url', 'ruleTemplateName', 'syncInterval']);
    } else {
      form.resetFields();
    }
    setDbType('');
    updateGlobalRuleTemplateList();
  };

  useEffect(() => {
    updateTaskSourceList();
    updateDriverNameList();
    updateGlobalRuleTemplateList();

    const refreshGlobalTemplateTips = () => {
      setDbType('');
      updateGlobalRuleTemplateList();
    };

    EventEmitter.subscribe(
      EmitterKey.Refresh_Sync_Task_Rule_Template_Tips,
      refreshGlobalTemplateTips
    );

    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_Sync_Task_Rule_Template_Tips,
        refreshGlobalTemplateTips
      );
    };
  }, [
    updateDriverNameList,
    updateGlobalRuleTemplateList,
    updateTaskSourceList,
  ]);

  useEffect(() => {
    if (!!defaultValue) {
      form.setFieldsValue({
        source: defaultValue.source,
        version: defaultValue.version,
        url: defaultValue.url,
        instanceType: defaultValue.db_type,
        ruleTemplateName: defaultValue.global_rule_template,
        syncInterval: defaultValue.sync_instance_interval,
      });
    }
  }, [defaultValue, form]);

  return (
    <Form<SyncTaskFormFields>
      {...PageFormLayout}
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        name="source"
        label={t('syncDataSource.syncTaskForm.source')}
        rules={[{ required: true }]}
      >
        <Select
          disabled={!!defaultValue}
          allowClear
          placeholder={t('common.form.placeholder.select')}
        >
          {generateTaskSourceSelectOption()}
        </Select>
      </Form.Item>

      <Form.Item
        name="version"
        label={t('syncDataSource.syncTaskForm.version')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="url"
        label={t('syncDataSource.syncTaskForm.url')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="instanceType"
        label={t('syncDataSource.syncTaskForm.instanceType')}
        rules={[{ required: true }]}
      >
        <Select<string>
          disabled={!!defaultValue}
          allowClear
          onChange={dbTypeChange}
          placeholder={t('common.form.placeholder.select')}
        >
          {generateDriverSelectOptions()}
        </Select>
      </Form.Item>

      <Form.Item
        name="ruleTemplateName"
        label={t('syncDataSource.syncTaskForm.ruleTemplateName')}
        rules={[{ required: true }]}
      >
        <Select allowClear placeholder={t('common.form.placeholder.select')}>
          {generateGlobalRuleTemplateSelectOption(
            dbType || ruleTemplateListDefaultKey
          )}
        </Select>
      </Form.Item>

      <Form.Item
        name="syncInterval"
        label={t('syncDataSource.syncTaskForm.syncInterval')}
        initialValue="0 0 * * *"
        rules={[
          {
            validator(_, value) {
              const error = checkCron(value);
              if (error === '') {
                return Promise.resolve();
              }
              return Promise.reject(t(error));
            },
          },
        ]}
      >
        <CronInput />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <Button htmlType="submit" type="primary" loading={submitLoading}>
            {t('common.submit')}
          </Button>
          <Button onClick={resetForm} disabled={submitLoading}>
            {t('common.reset')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SyncTaskForm;
