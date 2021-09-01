import { useBoolean } from 'ahooks';
import { Button, Form, Input, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../../api/instance';
import { IGetInstanceTipListV1Params } from '../../../api/instance/index.d';
import CronInput from '../../../components/CronInput';
import { PageBigFormLayout, ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { checkCron } from '../../../hooks/useCron/cron.tool';
import useDatabaseType from '../../../hooks/useDatabaseType';
import useInstance from '../../../hooks/useInstance';
import useInstanceSchema from '../../../hooks/useInstanceSchema';
import EventEmitter from '../../../utils/EventEmitter';
import { nameRule } from '../../../utils/FormRule';
import { PlanFormField, PlanFormProps } from './index.type';

const PlanForm: React.FC<PlanFormProps> = (props) => {
  const { t } = useTranslation();

  const [dataSource, setDataSource] = useState('');
  const [form] = useForm<PlanFormField>();

  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();

  const getInstanceParams = useMemo<IGetInstanceTipListV1Params>(() => {
    if (!!props.defaultValue) {
      return { filter_db_type: props.defaultValue.audit_plan_db_type };
    }
    return {};
  }, [props.defaultValue]);

  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { generateInstanceSchemaSelectOption } = useInstanceSchema(dataSource);

  const handleDataSourceChange = (dataSource: string) => {
    setDataSource(dataSource);
    if (!!dataSource) {
      instance.getInstanceV1({ instance_name: dataSource }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          form.setFieldsValue({
            dbType: res.data.data?.db_type,
          });
        }
      });
    }
  };

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const submit = (values: PlanFormField) => {
    startSubmit();
    props.submit(values).finally(() => {
      submitFinish();
    });
  };

  const resetForm = () => {
    setDataSource('');
    if (!!props.defaultValue) {
      form.resetFields(['databaseName', 'cron', 'schema']);
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    if (props.defaultValue) {
      form.setFieldsValue({
        name: props.defaultValue.audit_plan_name,
        databaseName: props.defaultValue.audit_plan_instance_name,
        schema: props.defaultValue.audit_plan_instance_database,
        cron: props.defaultValue.audit_plan_cron,
        dbType: props.defaultValue.audit_plan_db_type,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValue]);

  useEffect(() => {
    updateDriverNameList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateInstanceList(getInstanceParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInstanceParams]);

  useEffect(() => {
    const reset = () => {
      resetForm();
    };
    EventEmitter.subscribe(EmitterKey.Rest_Audit_Plan_Form, reset);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Rest_Audit_Plan_Form, reset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...PageBigFormLayout} form={form} onFinish={submit}>
      <Form.Item
        label={t('auditPlan.planForm.name')}
        name="name"
        rules={[
          {
            required: true,
          },
          ...nameRule(),
        ]}
      >
        <Input
          disabled={!!props.defaultValue}
          placeholder={t('common.form.placeholder.input')}
        />
      </Form.Item>
      <Form.Item
        label={t('auditPlan.planForm.databaseName')}
        name="databaseName"
        tooltip={t('auditPlan.planForm.databaseNameTips')}
      >
        <Select
          allowClear
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
        <Select
          disabled={!!dataSource || !!props.defaultValue}
          placeholder={t('common.form.placeholder.select')}
        >
          {generateDriverSelectOptions()}
        </Select>
      </Form.Item>
      <Form.Item
        label={t('auditPlan.planForm.cron')}
        name="cron"
        rules={[
          {
            required: true,
          },
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

export default PlanForm;
