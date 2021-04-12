import { useTheme } from '@material-ui/styles';
import { useBoolean } from 'ahooks';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  PageHeader,
  Result,
  Space,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IAuditTaskResV1 } from '../../../api/common';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode, PageFormLayout } from '../../../data/common';
import { Theme } from '../../../types/theme.type';
import AuditResult from './AuditResult';
import SqlInfoForm from './SqlInfoForm';
import { SqlInfoFormFields } from './SqlInfoForm/index.type';

const CreateOrder = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [baseForm] = useForm();
  const [sqlInfoForm] = useForm<SqlInfoFormFields>();
  const [
    createLoading,
    { setTrue: startCreate, setFalse: createFinish },
  ] = useBoolean();
  const [visible, { setTrue: openModal, setFalse: closeModal }] = useBoolean();

  const [taskInfo, setTaskInfo] = React.useState<IAuditTaskResV1 | undefined>(
    undefined
  );

  const auditSql = React.useCallback(async (values: SqlInfoFormFields) => {
    const res = await task.createAndAuditTaskV1({
      instance_name: values.instanceName,
      instance_schema: values.instanceSchema,
      sql: values.sql,
      input_sql_file: values.sqlFile?.[0],
    });
    if (res.data.code === ResponseCode.SUCCESS) {
      setTaskInfo(res.data.data);
    }
  }, []);

  const create = React.useCallback(async () => {
    const values = await baseForm.validateFields();
    await sqlInfoForm.validateFields();
    if (!taskInfo) {
      message.error('您必须先对您的SQL进行审核才能进行创建工单');
      return;
    }
    startCreate();
    workflow
      .createWorkflowV1({
        task_id: `${taskInfo.task_id}`,
        desc: values.describe,
        workflow_subject: values.name,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          openModal();
        }
      })
      .finally(() => {
        createFinish();
      });
  }, [baseForm, createFinish, openModal, sqlInfoForm, startCreate, taskInfo]);

  const resetAllForm = React.useCallback(() => {
    baseForm.resetFields();
    sqlInfoForm.resetFields();
    setTaskInfo(undefined);
  }, [baseForm, sqlInfoForm]);

  const closeModalAndResetForm = React.useCallback(() => {
    closeModal();
    resetAllForm();
  }, [closeModal, resetAllForm]);

  return (
    <>
      <PageHeader title={t('order.baseInfo.title')} ghost={false}>
        {t('order.createOrder.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Space
          size={theme.common.padding}
          className="full-width-element"
          direction="vertical"
        >
          <Card title={t('order.baseInfo.title')}>
            <Form form={baseForm} {...PageFormLayout}>
              <Form.Item
                name="name"
                label={t('order.baseInfo.name')}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  placeholder={t('common.form.placeholder.input', {
                    name: t('order.baseInfo.name'),
                  })}
                />
              </Form.Item>
              <Form.Item name="describe" label={t('order.baseInfo.describe')}>
                <Input.TextArea
                  autoSize={{
                    maxRows: 10,
                    minRows: 3,
                  }}
                  placeholder={t('common.form.placeholder.input', {
                    name: t('order.baseInfo.describe'),
                  })}
                />
              </Form.Item>
            </Form>
          </Card>
          <SqlInfoForm form={sqlInfoForm} submit={auditSql} />
          <EmptyBox if={!!taskInfo}>
            <AuditResult task={taskInfo} />
          </EmptyBox>
          <Card className="text-align-right">
            <Space>
              <Button onClick={closeModalAndResetForm}>
                {t('common.resetAll')}
              </Button>
              <Button type="primary" onClick={create} loading={createLoading}>
                {t('order.createOrder.title')}
              </Button>
            </Space>
          </Card>
        </Space>
      </section>
      <Modal
        title={t('common.operateSuccess')}
        footer={null}
        closable={false}
        visible={visible}
      >
        <Result
          status="success"
          title={t('order.create.success')}
          subTitle={
            <Link to="/order">
              {t('order.create.guide')} {'>'}
            </Link>
          }
          extra={[
            <Button key="close" onClick={closeModal}>
              {t('common.close')}
            </Button>,
            <Button
              type="primary"
              key="resetAndClose"
              onClick={closeModalAndResetForm}
            >
              {t('common.resetAndClose')}
            </Button>,
          ]}
        />
      </Modal>
    </>
  );
};

export default CreateOrder;
