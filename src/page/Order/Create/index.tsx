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
import { cloneDeep, remove } from 'lodash';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IAuditTaskResV1 } from '../../../api/common';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
} from '../../../api/common.enum';
import task from '../../../api/task';
import {
  IAuditTaskGroupIdV1Params,
  ICreateAndAuditTaskV1Params,
  ICreateAuditTasksV1Params,
} from '../../../api/task/index.d';
import workflow from '../../../api/workflow';
import { ICreateWorkflowV2Params } from '../../../api/workflow/index.d';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode, PageFormLayout } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { Theme } from '../../../types/theme.type';
import EventEmitter from '../../../utils/EventEmitter';
import { nameRule } from '../../../utils/FormRule';
import AuditResultCollection from '../AuditResult/AuditResultCollection';
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
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);
  const [auditResultActiveKey, setAuditResultActiveKey] = useState<string>('');
  const [taskSqlNum, setTaskSqlNum] = useState<Map<string, number>>(new Map());
  const [differenceSqlTabIndexTaskIdMap, setDifferenceSqlTanIndexTaskIdMap] =
    useState<Map<number, string>>(new Map());

  const [
    isCreateOrderDisabled,
    { setTrue: setCreateOrderDisabled, setFalse: resetCreateOrderBtnStatus },
  ] = useBoolean(false);

  const {
    disabledOperatorOrderBtnTips,
    judgeAuditLevel,
    setDisabledOperatorOrderBtnTips,
  } = useAllowAuditLevel();

  const auditSameSqlMode = useCallback((values: SqlInfoFormFields) => {
    const createAuditTasksParams: ICreateAuditTasksV1Params = {
      instances:
        values.dataBaseInfo.map((v) => ({
          instance_name: v.instanceName,
          instance_schema: v.instanceSchema,
        })) ?? [],
    };
    return task.createAuditTasksV1(createAuditTasksParams).then((res) => {
      if (
        res.data.code === ResponseCode.SUCCESS &&
        res.data.data?.task_group_id
      ) {
        const auditTaskPrams: IAuditTaskGroupIdV1Params = {
          task_group_id: res.data.data?.task_group_id,
          sql: values.sql,
          input_sql_file: values.sqlFile?.[0],
          input_mybatis_xml_file: values.mybatisFile?.[0],
        };
        return task.auditTaskGroupIdV1(auditTaskPrams).then((res) => {
          if (res && res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        });
      }
    });
  }, []);

  const auditDifferenceSqlMode = useCallback(
    (values: SqlInfoFormFields, currentTabIndex: number) => {
      const params: ICreateAndAuditTaskV1Params = {
        instance_name: values.dataBaseInfo[currentTabIndex].instanceName,
        instance_schema: values.dataBaseInfo[currentTabIndex].instanceSchema,
        sql: values.sql,
        input_sql_file: values.sqlFile?.[0],
        input_mybatis_xml_file: values.mybatisFile?.[0],
      };
      return task.createAndAuditTaskV1(params).then((res) => {
        if (res && res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
      });
    },
    []
  );

  const auditSql = useCallback(
    async (values: SqlInfoFormFields, currentTabIndex: number) => {
      const commonJudgeAuditLevel = (tasks: IAuditTaskResV1[]) => {
        judgeAuditLevel(
          tasks.map((v) => ({
            instanceName: v.instance_name ?? '',
            currentAuditLevel: v.audit_level as
              | CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
              | undefined,
          })) ?? [],
          setCreateOrderDisabled,
          resetCreateOrderBtnStatus
        );
      };

      if (values.isSameSqlOrder) {
        const res = await auditSameSqlMode(values);
        if (res && res.tasks) {
          setTaskInfos(res.tasks);
          if (res.tasks.length > 0) {
            setAuditResultActiveKey(res?.tasks?.[0].task_id?.toString() ?? '');
            commonJudgeAuditLevel(res.tasks);
          }
        }
      } else {
        const res = await auditDifferenceSqlMode(values, currentTabIndex);
        setDifferenceSqlTanIndexTaskIdMap((v) => {
          const cloneValue = cloneDeep(v);
          cloneValue.set(currentTabIndex, res?.task_id?.toString() ?? '');
          return cloneValue;
        });
        if (res) {
          const cloneTaskInfos = cloneDeep(taskInfos);
          const previousTaskId =
            differenceSqlTabIndexTaskIdMap.get(currentTabIndex);
          if (previousTaskId) {
            remove(
              cloneTaskInfos,
              (v) => v.task_id?.toString() === previousTaskId
            );
          }

          setAuditResultActiveKey(res.task_id?.toString() ?? '');
          setTaskInfos([...cloneTaskInfos, res]);
          commonJudgeAuditLevel([...cloneTaskInfos, res]);
        }
      }
    },
    [
      differenceSqlTabIndexTaskIdMap,
      auditDifferenceSqlMode,
      auditSameSqlMode,
      judgeAuditLevel,
      resetCreateOrderBtnStatus,
      setCreateOrderDisabled,
      taskInfos,
    ]
  );

  const create = async () => {
    try {
      const values = await baseForm.validateFields();
      const { isSameSqlOrder, dataBaseInfo } =
        await sqlInfoForm.validateFields();
      if (!isSameSqlOrder && dataBaseInfo.length !== taskInfos.length) {
        message.error(
          t('order.createOrder.InDifferenceSqlModeShouldAuditAllInstance')
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
    }
  };

  const clearTaskInfos = () => {
    setTaskInfos([]);
  };

  const resetAllForm = useCallback(() => {
    baseForm.resetFields();
    sqlInfoForm.resetFields();
    clearTaskInfos();
    toggleHasDirtyData(false);
    EventEmitter.emit(EmitterKey.Reset_Create_Order_Form);
  }, [baseForm, sqlInfoForm, toggleHasDirtyData]);

  const closeModalAndResetForm = useCallback(() => {
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
                  maxLength={50}
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
            />
          </Card>

          <EmptyBox if={taskInfos.length > 0}>
            <AuditResultCollection
              taskInfos={taskInfos}
              auditResultActiveKey={auditResultActiveKey}
              setAuditResultActiveKey={setAuditResultActiveKey}
              updateTaskRecordTotalNum={updateTaskRecordTotalNum}
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
                    overlayClassName="whitespace-pre-line"
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
                  disabled={createLoading || isCreateOrderDisabled}
                  placement="topRight"
                >
                  <Tooltip
                    overlayClassName="whitespace-pre-line"
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
