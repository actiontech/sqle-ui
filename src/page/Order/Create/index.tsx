import { useTheme } from '@material-ui/styles';
import { useBoolean, useToggle } from 'ahooks';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Result,
  Space,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IAuditTaskResV1 } from '../../../api/common';
import { AuditTaskResV1SqlSourceEnum } from '../../../api/common.enum';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode, PageFormLayout } from '../../../data/common';
import { Theme } from '../../../types/theme.type';
import { nameRule } from '../../../utils/FormRule';
import AuditResult from './AuditResult';
import SqlInfoForm from './SqlInfoForm';
import { SqlInfoFormFields } from './SqlInfoForm/index.type';

const CreateOrder = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [baseForm] = useForm();
  const [sqlInfoForm] = useForm<SqlInfoFormFields>();
  const [hasDirtyData, { toggle: toggleHasDirtyData }] = useToggle(false);
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
      input_mybatis_xml_file: values.mybatisFile?.[0],
    });
    if (res.data.code === ResponseCode.SUCCESS) {
      setTaskInfo(res.data.data);
    }
  }, []);

  const create = React.useCallback(async () => {
    try {
      const values = await baseForm.validateFields();
      await sqlInfoForm.validateFields();
      if (
        taskInfo?.sql_source === AuditTaskResV1SqlSourceEnum.mybatis_xml_file
      ) {
        message.error(t('order.createOrder.unsupportMybatisTips'));
        return;
      }
      if (!taskInfo) {
        message.error(t('order.createOrder.mustAuditTips'));
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
    } catch (error) {
      baseForm.scrollToField('name');
    }
  }, [
    baseForm,
    createFinish,
    openModal,
    sqlInfoForm,
    startCreate,
    t,
    taskInfo,
  ]);

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
            <Form form={baseForm} {...PageFormLayout} scrollToFirstError>
              <Form.Item
                name="name"
                label={t('order.baseInfo.name')}
                validateFirst={true}
                rules={[
                  {
                    required: true,
                  },
                  ...nameRule(),
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
          <SqlInfoForm
            form={sqlInfoForm}
            submit={auditSql}
            updateDirtyData={toggleHasDirtyData}
          />
          <EmptyBox if={!!taskInfo}>
            <AuditResult task={taskInfo} />
          </EmptyBox>
          <Card className="text-align-right">
            <Space>
              <Button onClick={closeModalAndResetForm}>
                {t('common.resetAll')}
              </Button>
              <EmptyBox
                if={hasDirtyData}
                defaultNode={
                  <Button
                    htmlType="submit"
                    type="primary"
                    onClick={create}
                    loading={createLoading}
                  >
                    {t('order.createOrder.title')}
                  </Button>
                }
              >
                <Popconfirm
                  title={t('order.createOrder.dirtyDataTips')}
                  onConfirm={create}
                  overlayClassName="popconfirm-small"
                  disabled={createLoading}
                  placement="topRight"
                >
                  <Button
                    htmlType="submit"
                    type="primary"
                    loading={createLoading}
                  >
                    {t('order.createOrder.title')}
                  </Button>
                </Popconfirm>
              </EmptyBox>
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
