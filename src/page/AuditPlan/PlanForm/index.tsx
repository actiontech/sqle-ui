import { Button, Form, Input, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../../api/instance';
import CronInput from '../../../components/CronInput';
import { PageBigFormLayout, ResponseCode } from '../../../data/common';
import useDatabaseType from '../../../hooks/useDatabaseType';
import useInstance from '../../../hooks/useInstance';
import useInstanceSchema from '../../../hooks/useInstanceSchema';
import { nameRule } from '../../../utils/FormRule';
import { PlanFormField } from './index.type';

const PlanForm = () => {
  const { t } = useTranslation();

  const [dataSource, setDataSource] = useState('');
  const [form] = useForm<PlanFormField>();

  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();
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

  const submit = (values: PlanFormField) => {
    console.log(111, values);
  };

  useEffect(() => {
    updateDriverNameList();
    updateInstanceList();
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
        <Input placeholder={t('common.form.placeholder.input')} />
      </Form.Item>
      <Form.Item
        label={t('auditPlan.planForm.databaseName')}
        name="databaseName"
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
          disabled={!!dataSource}
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
        ]}
      >
        <CronInput />
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Space>
          <Button htmlType="submit" type="primary">
            {t('common.submit')}
          </Button>
          <Button>{t('common.reset')}</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PlanForm;
