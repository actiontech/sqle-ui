import { useBoolean } from 'ahooks';
import { Button, Form, Input, Select } from 'antd';
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
import useGlobalRuleTemplate from '../../../hooks/useGlobalRuleTemplate';
import useTaskSource from '../../../hooks/useTaskSource';
import EventEmitter from '../../../utils/EventEmitter';
import FooterButtonWrapper from '../../../components/FooterButtonWrapper';

const SyncTaskForm: React.FC<SyncTaskFormProps> = ({
  form,
  submit,
  defaultValue,
}) => {
  const { t } = useTranslation();
  const [dbType, setDbType] = useState('');
  const [source, setSource] = useState('');
  const {
    updateTaskSourceList,
    generateTaskSourceSelectOption,
    generateTaskSourceDbTypesSelectOption,
  } = useTaskSource();

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

  const sourceChange = (source: string) => {
    setSource(source);
    form.setFieldsValue({
      instanceType: undefined,
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
    setSource('');
    updateGlobalRuleTemplateList();
  };

  useEffect(() => {
    updateTaskSourceList();
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
  }, [updateGlobalRuleTemplateList, updateTaskSourceList]);

  useEffect(() => {
    if (!!defaultValue) {
      form.setFieldsValue({
        source: defaultValue.source,
        version: defaultValue.version,
        url: defaultValue.url,
        instanceType: defaultValue.db_type,
        ruleTemplateName: defaultValue.rule_template,
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
          onChange={sourceChange}
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
          {generateTaskSourceDbTypesSelectOption(source)}
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

      <FooterButtonWrapper insideProject={false}>
        <Button htmlType="submit" type="primary" loading={submitLoading}>
          {t('common.submit')}
        </Button>
        <Button onClick={resetForm} disabled={submitLoading}>
          {t('common.reset')}
        </Button>
      </FooterButtonWrapper>
    </Form>
  );
};

export default SyncTaskForm;
