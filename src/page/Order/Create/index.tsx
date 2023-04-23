import { useTheme } from '@mui/styles';
import { useBoolean } from 'ahooks';
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
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuditTaskResV1SqlSourceEnum } from '../../../api/common.enum';
import workflow from '../../../api/workflow';
import { ICreateWorkflowV2Params } from '../../../api/workflow/index.d';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode, PageFormLayout } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { t } from '../../../locale';
import { FormValidatorRule } from '../../../types/common.type';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import AuditResultCollection from '../AuditResult/AuditResultCollection';
import useAuditOrder from '../hooks/useAuditOrder';
import SqlInfoForm from './SqlInfoForm';
import { SqlInfoFormFields } from './SqlInfoForm/index.type';
import { Theme } from '@mui/material/styles';
import { Link } from '../../../components/Link';

export const workflowNameRule = (): FormValidatorRule => {
  return (_, value) => {
    const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9_-]*$/;
    if (!reg.test(value)) {
      return Promise.reject(t('order.createOrder.workflowNameRule'));
    }
    return Promise.resolve();
  };
};

const CreateOrder = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [baseForm] = useForm();
  const [sqlInfoForm] = useForm<SqlInfoFormFields>();
  const [hasDirtyData, toggleHasDirtyData] = useState(false);
  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();
  const [visible, { setTrue: openModal, setFalse: closeModal }] = useBoolean();
  const [taskSqlNum, setTaskSqlNum] = useState<Map<string, number>>(new Map());
  useState<Map<number, string>>(new Map());
  const { projectName } = useCurrentProjectName();
  const {
    taskInfos,
    auditOrderWithSameSql,
    auditOrderWthDifferenceSql,
    auditResultActiveKey,
    setAuditResultActiveKey,
    isDisableFinallySubmitButton,
    disabledOperatorOrderBtnTips,
    resetFinallySubmitButtonStatus,
    clearDifferenceSqlModeTaskInfos,
    clearTaskInfoWithKey,
  } = useAuditOrder();

  const auditSql = useCallback(
    async (
      values: SqlInfoFormFields,
      currentTabIndex: number,
      currentTabKey: string
    ) => {
      if (values.isSameSqlOrder) {
        auditOrderWithSameSql(values);
      } else {
        auditOrderWthDifferenceSql(values, currentTabIndex, currentTabKey);
      }
    },
    [auditOrderWithSameSql, auditOrderWthDifferenceSql]
  );

  const create = async () => {
    try {
      const values = await baseForm.validateFields();
      const { isSameSqlOrder, dataBaseInfo } =
        await sqlInfoForm.validateFields();
      if (!isSameSqlOrder && dataBaseInfo.length !== taskInfos.length) {
        message.error(
          t('order.createOrder.inDifferenceSqlModeShouldAuditAllInstance')
        );
        return;
      }
      if (
        taskInfos?.some(
          (v) => v.sql_source === AuditTaskResV1SqlSourceEnum.mybatis_xml_file
        )
      ) {
        message.error(t('order.createOrder.unsupportMybatisTips'));
        return;
      }
      if (!taskInfos?.length) {
        message.error(t('order.createOrder.mustAuditTips'));
        return;
      }
      if (
        Array.from(taskSqlNum).some(([task, len]) => {
          return (
            taskInfos.some((v) => v.task_id?.toString() === task) && len === 0
          );
        })
      ) {
        message.error(t('order.createOrder.mustHaveAuditResultTips'));
        return;
      }
      startCreate();
      const createWorkflowParam: ICreateWorkflowV2Params = {
        task_ids: taskInfos.map((v) => v.task_id!),
        desc: values.describe,
        workflow_subject: values.name,
        project_name: projectName,
      };
      workflow
        .createWorkflowV2(createWorkflowParam)
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
    } finally {
      clearDifferenceSqlModeTaskInfos();
    }
  };

  const clearTaskInfos = useCallback(() => {
    clearDifferenceSqlModeTaskInfos();
  }, [clearDifferenceSqlModeTaskInfos]);

  const resetAllForm = useCallback(() => {
    baseForm.resetFields();
    sqlInfoForm.resetFields();
    clearTaskInfos();
    toggleHasDirtyData(false);
    EventEmitter.emit(EmitterKey.Reset_Create_Order_Form);
  }, [baseForm, clearTaskInfos, sqlInfoForm, toggleHasDirtyData]);

  const closeModalAndResetForm = useCallback(() => {
    closeModal();
    resetAllForm();
    resetFinallySubmitButtonStatus();
  }, [closeModal, resetAllForm, resetFinallySubmitButtonStatus]);

  const instanceNameChange = async (name: string) => {
    const orderName = baseForm.getFieldValue('name');
    if (!orderName) {
      baseForm.setFieldsValue({
        name: `${name}_${moment().format('YYYYMMDDhhmmss')}`,
      });
    }
  };

  const updateTaskRecordTotalNum = (taskId: string, sqlNumber: number) => {
    setTaskSqlNum((v) => {
      const cloneValue = cloneDeep(v);
      cloneValue?.set(taskId, sqlNumber);
      return cloneValue;
    });
  };

  return (
    <>
      <PageHeader title={t('order.createOrder.title')} ghost={false}>
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
                  {
                    validator: workflowNameRule(),
                  },
                  {
                    max: 59,
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
                  maxLength={3000}
                  showCount
                />
              </Form.Item>
            </Form>
          </Card>

          <Card title={t('order.sqlInfo.title')}>
            <SqlInfoForm
              form={sqlInfoForm}
              submit={auditSql}
              updateDirtyData={toggleHasDirtyData}
              instanceNameChange={instanceNameChange}
              clearTaskInfos={clearTaskInfos}
              clearTaskInfoWithKey={clearTaskInfoWithKey}
              projectName={projectName}
            />
          </Card>

          <EmptyBox if={taskInfos.length > 0}>
            <AuditResultCollection
              taskInfos={taskInfos}
              auditResultActiveKey={auditResultActiveKey}
              setAuditResultActiveKey={setAuditResultActiveKey}
              updateTaskRecordTotalNum={updateTaskRecordTotalNum}
              projectName={projectName}
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
                      isDisableFinallySubmitButton
                        ? disabledOperatorOrderBtnTips
                        : ''
                    }
                    overlayClassName="whitespace-pre-line"
                  >
                    <Button
                      htmlType="submit"
                      type="primary"
                      onClick={create}
                      disabled={isDisableFinallySubmitButton}
                      loading={createLoading}
                    >
                      {t('order.createOrder.button')}
                    </Button>
                  </Tooltip>
                }
              >
                <Popconfirm
                  title={t('order.createOrder.dirtyDataTips')}
                  onConfirm={create}
                  overlayClassName="popconfirm-small"
                  disabled={createLoading || isDisableFinallySubmitButton}
                  placement="topRight"
                >
                  <Tooltip
                    overlayClassName="whitespace-pre-line"
                    title={
                      isDisableFinallySubmitButton
                        ? disabledOperatorOrderBtnTips
                        : ''
                    }
                  >
                    <Button
                      htmlType="submit"
                      type="primary"
                      loading={createLoading}
                      disabled={isDisableFinallySubmitButton}
                    >
                      {t('order.createOrder.button')}
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
        open={visible}
      >
        <Result
          status="success"
          title={t('order.create.success')}
          subTitle={
            <Link to={`project/${projectName}/order`}>
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
