import { useBoolean } from 'ahooks';
import { Alert, Button, Modal, Space, Tabs } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IAuditTaskResV1 } from '../../../../../api/common';
import {
  AuditTaskResV1SqlSourceEnum,
  WorkflowResV2ModeEnum,
} from '../../../../../api/common.enum';
import task from '../../../../../api/task';
import {
  IAuditTaskGroupIdV1Params,
  ICreateAndAuditTaskV1Params,
  ICreateAuditTasksV1Params,
} from '../../../../../api/task/index.d';
import EmptyBox from '../../../../../components/EmptyBox';
import { ModalSize, ResponseCode } from '../../../../../data/common';
import { ModifySqlModalProps } from './index.type';
import ModifySqlForm from './ModifySqlForm';
import { ModifySqlFormFields } from './ModifySqlForm/index.type';

const ModifySqlModal: React.FC<ModifySqlModalProps> = ({
  currentOrderTasks,
  sqlMode,
  ...props
}) => {
  const { t } = useTranslation();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [currentTab, setCurrentTab] = useState('');
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);
  const [sqlFormInfo, setSqlFormInfo] = useState<
    Map<string, ModifySqlFormFields>
  >(new Map());
  const [currentDefaultSqlValue, setCurrentDefaultValue] = useState('');
  const [differenceSqlTabIndexTaskIdMap, setDifferenceSqlTabIndexTaskIdMap] =
    useState<Map<number, string>>(new Map());

  const auditSameSqlMode = () => {
    const createAuditTasksParams: ICreateAuditTasksV1Params = {
      instances:
        taskInfos.map((v) => ({
          instance_name: v.instance_name,
          instance_schema: v.instance_schema,
        })) ?? [],
    };

    const values = sqlFormInfo.get(taskInfos[0]?.task_id?.toString()!);
    let sql: string | undefined;
    if (values) {
      sql = values.sql;
    } else {
      sql = currentDefaultSqlValue;
    }
    return task.createAuditTasksV1(createAuditTasksParams).then((res) => {
      if (
        res.data.code === ResponseCode.SUCCESS &&
        res.data.data?.task_group_id
      ) {
        const auditTaskPrams: IAuditTaskGroupIdV1Params = {
          task_group_id: res.data.data?.task_group_id,
          sql: sql,
          input_sql_file: values?.sqlFile?.[0],
        };
        return task.auditTaskGroupIdV1(auditTaskPrams).then((res) => {
          if (res && res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        });
      }
    });
  };

  const auditDifferenceSqlMode = () => {
    const currentTask = taskInfos.find(
      (v) => v.task_id?.toString() === currentTab
    );
    if (!currentTask) {
      submitFinish();
      return;
    }
    const values = sqlFormInfo.get(currentTab);
    let sql: string | undefined;
    if (values) {
      sql = values.sql;
    } else {
      sql = currentDefaultSqlValue;
    }
    const params: ICreateAndAuditTaskV1Params = {
      instance_name: currentTask.instance_name ?? '',
      instance_schema: currentTask.instance_schema ?? '',
      sql: sql,
      input_sql_file: values?.sqlFile?.[0],
    };
    return task.createAndAuditTaskV1(params).then((res) => {
      if (res && res.data.code === ResponseCode.SUCCESS) {
        return res.data.data;
      }
    });
  };

  const auditSql = async () => {
    startSubmit();
    if (sqlMode === WorkflowResV2ModeEnum.same_sqls) {
      auditSameSqlMode()
        ?.then((res) => {
          if (res && res.tasks) {
            setTaskInfos(res.tasks);
            props.submit(res.tasks);
          }
        })
        .finally(() => {
          submitFinish();
        });
    } else {
      auditDifferenceSqlMode()
        ?.then((res) => {
          const currentTabIndex = taskInfos.findIndex(
            (v) => v.task_id?.toString() === currentTab
          );
          if (currentTabIndex === -1) {
            return;
          }
          setDifferenceSqlTabIndexTaskIdMap((v) => {
            const cloneValue = cloneDeep(v);
            cloneValue.set(currentTabIndex, res?.task_id?.toString() ?? '');
            return cloneValue;
          });
          if (res) {
            let existIndex = -1;
            const cloneTaskInfos = cloneDeep(taskInfos);
            const previousTaskId =
              differenceSqlTabIndexTaskIdMap.get(currentTabIndex);
            if (previousTaskId) {
              existIndex = cloneTaskInfos.findIndex(
                (v) => v.task_id?.toString() === previousTaskId
              );
              if (existIndex !== -1) {
                cloneTaskInfos.splice(existIndex, 1);
              }
            }
            if (existIndex === -1) {
              cloneTaskInfos.push(res);
            } else {
              cloneTaskInfos.splice(existIndex, 0, res);
            }
            setTaskInfos(cloneTaskInfos);
            props.submit(cloneTaskInfos);
            setCurrentTab(res.task_id?.toString() ?? '');
          }
        })
        .finally(() => {
          submitFinish();
        });
    }
  };

  const updateSqlFormInfo = (taskId: string, values: ModifySqlFormFields) => {
    setSqlFormInfo((v) => {
      const cloneValue = cloneDeep(v);
      cloneValue.set(taskId, values);
      return cloneValue;
    });
  };

  useEffect(() => {
    const currentTask = taskInfos.find(
      (v) => v.task_id?.toString() === currentTab
    );
    if (
      props.visible &&
      currentTask?.sql_source === AuditTaskResV1SqlSourceEnum.form_data
    ) {
      task
        .getAuditTaskSQLContentV1({
          task_id: `${currentTask.task_id}`,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setCurrentDefaultValue(res.data.data?.sql ?? '');
          }
        });
    }
  }, [taskInfos, currentTab, props.visible]);

  useEffect(() => {
    setTaskInfos(currentOrderTasks ?? []);
    setCurrentTab(currentOrderTasks?.[0]?.task_id?.toString() ?? '');
    (currentOrderTasks ?? []).forEach((order, index) => {
      setDifferenceSqlTabIndexTaskIdMap((v) => {
        const cloneValue = cloneDeep(v);
        cloneValue.set(index, order?.task_id?.toString() ?? '');
        return cloneValue;
      });
    });
  }, [currentOrderTasks]);

  return (
    <Modal
      title={t('order.modifySql.title')}
      width={ModalSize.big}
      visible={props.visible}
      closable={false}
      footer={
        <Space>
          <Alert message={t('order.modifySql.submitTips')} type="warning" />
          <Button onClick={props.cancel} disabled={submitLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={auditSql} loading={submitLoading}>
            {t('common.submit')}
          </Button>
        </Space>
      }
    >
      <EmptyBox
        if={sqlMode === WorkflowResV2ModeEnum.different_sqls}
        defaultNode={
          <ModifySqlForm
            updateSqlFormInfo={updateSqlFormInfo}
            currentTaskId={taskInfos[0]?.task_id?.toString() ?? ''}
            currentDefaultSqlValue={currentDefaultSqlValue}
          />
        }
      >
        <Tabs
          activeKey={currentTab}
          onChange={(tabKey) => {
            setCurrentTab(tabKey);
          }}
        >
          {taskInfos.map((v) => {
            return (
              <Tabs.TabPane tab={v.instance_name} key={v.task_id}>
                <ModifySqlForm
                  updateSqlFormInfo={updateSqlFormInfo}
                  currentTaskId={v.task_id?.toString()!}
                  currentDefaultSqlValue={currentDefaultSqlValue}
                />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </EmptyBox>
    </Modal>
  );
};

export default ModifySqlModal;
