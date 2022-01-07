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
  Tooltip,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IAuditTaskResV1 } from '../../../api/common';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
} from '../../../api/common.enum';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode, PageFormLayout } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { Theme } from '../../../types/theme.type';
import EventEmitter from '../../../utils/EventEmitter';
import { nameRule } from '../../../utils/FormRule';
import AuditResult from '../AuditResult';
import { useAllowAuditLevel } from '../hooks/useAllowAuditLevel';
import SqlInfoForm from './SqlInfoForm';
import { SqlInfoFormFields } from './SqlInfoForm/index.type';

const CreateOrder = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [baseForm] = useForm();
  const [sqlInfoForm] = useForm<SqlInfoFormFields>();
  const [hasDirtyData, { toggle: toggleHasDirtyData }] = useToggle(false);
  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();
  const [visible, { setTrue: openModal, setFalse: closeModal }] = useBoolean();
  const [taskInfo, setTaskInfo] = React.useState<IAuditTaskResV1 | undefined>(
    undefined
  );
  const [
    isCreateOrderDisabled,
    { setTrue: setCreateOrderDisabled, setFalse: resetCreateOrderBtnStatus },
  ] = useBoolean(false);

  const {
    disabledOperatorOrderBtnTips,
    judgeAuditLevel,
    setDisabledOperatorOrderBtnTips,
  } = useAllowAuditLevel();

  const auditSql = React.useCallback(
    async (values: SqlInfoFormFields) => {
      const res = await task.createAndAuditTaskV1({
        instance_name: values.instanceName,
        instance_schema: values.instanceSchema,
        sql: values.sql,
        input_sql_file: values.sqlFile?.[0],
        input_mybatis_xml_file: values.mybatisFile?.[0],
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        setTaskInfo(res.data.data);
        if (res.data.data?.instance_name) {
          judgeAuditLevel(
            res.data.data.instance_name,
            setCreateOrderDisabled,
            res.data.data.audit_level as
              | CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
              | undefined
          );
        }
      }
    },
    [judgeAuditLevel, setCreateOrderDisabled]
  );

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
    toggleHasDirtyData(false);
    EventEmitter.emit(EmitterKey.Reset_Create_Order_Form);
  }, [baseForm, sqlInfoForm, toggleHasDirtyData]);

  const closeModalAndResetForm = React.useCallback(() => {
    closeModal();
    resetAllForm();
    resetCreateOrderBtnStatus();
    setDisabledOperatorOrderBtnTips('');
  }, [
    closeModal,
    resetAllForm,
    resetCreateOrderBtnStatus,
    setDisabledOperatorOrderBtnTips,
  ]);

  // const disabledOperatorOrderBtnTips =
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
            <AuditResult
              taskId={taskInfo?.task_id}
              passRate={taskInfo?.pass_rate}
            />
          </EmptyBox>
          <Card className="text-align-right">
            <Space>
              <Button onClick={closeModalAndResetForm}>
                {t('common.resetAll')}
              </Button>
              <EmptyBox
                if={hasDirtyData}
                defaultNode={
                  <Tooltip
                    title={
                      isCreateOrderDisabled ? disabledOperatorOrderBtnTips : ''
                    }
                  >
                    <Button
                      htmlType="submit"
                      type="primary"
                      onClick={create}
                      disabled={isCreateOrderDisabled}
                      loading={createLoading}
                    >
                      {t('order.createOrder.title')}
                    </Button>
                  </Tooltip>
                }
              >
                <Popconfirm
                  title={t('order.createOrder.dirtyDataTips')}
                  onConfirm={create}
                  overlayClassName="popconfirm-small"
                  disabled={createLoading}
                  placement="topRight"
                >
                  <Tooltip
                    title={
                      isCreateOrderDisabled ? disabledOperatorOrderBtnTips : ''
                    }
                  >
                    <Button
                      htmlType="submit"
                      type="primary"
                      loading={createLoading}
                      disabled={isCreateOrderDisabled}
                    >
                      {t('order.createOrder.title')}
                    </Button>
                  </Tooltip>
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
