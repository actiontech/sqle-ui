import { useBoolean } from 'ahooks';
import { useCallback, useRef, useState } from 'react';
import { IAuditTaskResV1 } from '../../../api/common';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '../../../api/common.enum';
import task from '../../../api/task';
import {
  IAuditTaskGroupIdV1Params,
  ICreateAndAuditTaskV1Params,
  ICreateAuditTasksV1Params,
} from '../../../api/task/index.d';
import { ResponseCode } from '../../../data/common';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { SqlInfoFormFields } from '../Create/SqlInfoForm/index.type';
import { SqlStatementFields } from '../SqlStatementFormTabs';
import { useAllowAuditLevel } from './useAllowAuditLevel';

const useAuditOrder = () => {
  const { projectName } = useCurrentProjectName();
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);
  const [auditResultActiveKey, setAuditResultActiveKey] = useState<string>('');
  const catchTaskInfos = useRef<IAuditTaskResV1[]>([]);
  const catchTaskId = useRef<Map<string, string>>(new Map([]));
  const [
    isDisableFinallySubmitButton,
    {
      setTrue: disableFinallySubmitButton,
      setFalse: cancelDisableFinallySubmitButton,
    },
  ] = useBoolean(false);

  const {
    disabledOperatorOrderBtnTips,
    judgeAuditLevel,
    setDisabledOperatorOrderBtnTips,
  } = useAllowAuditLevel();

  const resetFinallySubmitButtonStatus = useCallback(() => {
    cancelDisableFinallySubmitButton();
    setDisabledOperatorOrderBtnTips('');
  }, [cancelDisableFinallySubmitButton, setDisabledOperatorOrderBtnTips]);

  const commonJudgeAuditLevel = useCallback(
    (tasks: IAuditTaskResV1[]) => {
      judgeAuditLevel(
        tasks.map((v) => ({
          projectName,
          instanceName: v.instance_name ?? '',
          currentAuditLevel: v.audit_level as
            | WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
            | undefined,
        })) ?? [],
        disableFinallySubmitButton,
        cancelDisableFinallySubmitButton
      );
    },
    [
      cancelDisableFinallySubmitButton,
      disableFinallySubmitButton,
      judgeAuditLevel,
      projectName,
    ]
  );

  /**
   * 相同 sql 模式下的表单提交
   * @param values 提交的表单数据
   *
   * values 数据格式:
   * {
   *    0: SqlStatementFields, sql语句信息, 因为相同sql模式下只会有一份该数据, 所以默认 key 值取 ‘0’, 这里的 ‘0’ 来自 SqlStatementForm 中的 generateFieldName
   *    dataBaseInfo:  Array<DatabaseInfoFields>, 数据源以及数据库信息, 可能会有多份
   * }
   * 1. 首先使用 createAuditTasksV1 接口提交数据 获取 task_group_id
   * 2. 再使用 auditTaskGroupIdV1 提交后获取最后的 tasks 数据
   * 3. 通过 tasks 数据去判断是否可以进行最后的创建或者修改. 大致逻辑为判断 sql 语句的规则等级, 详细逻辑见 useAllowAuditLevel
   * 4. 返回 taskInfos
   */
  const auditOrderWithSameSql = useCallback(
    async (values: SqlInfoFormFields) => {
      const sqlStatementInfo = values['0'] as SqlStatementFields;

      const createAuditTasksParams: ICreateAuditTasksV1Params = {
        project_name: projectName,
        instances:
          values.dataBaseInfo.map((v) => ({
            instance_name: v.instanceName,
            instance_schema: v.instanceSchema,
          })) ?? [],
      };
      let taskInfos: IAuditTaskResV1[] = [];
      const taskGroupInfo = await task.createAuditTasksV1(
        createAuditTasksParams
      );
      if (
        taskGroupInfo.data.code === ResponseCode.SUCCESS &&
        taskGroupInfo.data.data?.task_group_id
      ) {
        const auditTaskPrams: IAuditTaskGroupIdV1Params = {
          task_group_id: taskGroupInfo.data.data?.task_group_id,
          sql: sqlStatementInfo.sql,
          input_sql_file: sqlStatementInfo.sqlFile?.[0],
          input_mybatis_xml_file: sqlStatementInfo.mybatisFile?.[0],
          input_zip_file: sqlStatementInfo.zipFile?.[0],
        };
        const res = await task.auditTaskGroupIdV1(auditTaskPrams);
        if (res && res.data.code === ResponseCode.SUCCESS) {
          taskInfos = res.data.data?.tasks ?? [];
          setTaskInfos(taskInfos);
          if (taskInfos.length > 0) {
            setAuditResultActiveKey(taskInfos?.[0].task_id?.toString() ?? '');
            commonJudgeAuditLevel(taskInfos);
          }
        }
      }
    },
    [commonJudgeAuditLevel, projectName]
  );

  /**
   * 不同 sql 模式下的表单提交
   * @param values 提交的表单数据
   *
   * values 数据格式
   * {
   *   [key in {0, 1, 2...}]: SqlStatementFields, sql语句信息, 因为不同sql模式下只会多份数据, 这里的 key 值对应的是 sql 语句录入 的 tabs 的 key
   *   dataBaseInfo:  Array<DatabaseInfoFields>, 数据源以及数据库信息, 可能会有多份
   * }
   *
   * 1. 直接通过 createAndAuditTaskV1 获取 taskInfo 数据
   * 2. 因为每次提交时 仅仅只对当前 tab 下个 sql 语句进行审核, 所以需要注意的是再次对已经审核过的 tab 时, 需要使用新的 taskInfo 替换掉之前的数据
   */
  const auditOrderWthDifferenceSql = useCallback(
    async (
      values: SqlInfoFormFields,
      currentTabIndex: number,
      currentTabKey: string
    ) => {
      const sqlStatementInfo = values[currentTabKey] as SqlStatementFields;
      const params: ICreateAndAuditTaskV1Params = {
        project_name: projectName,
        instance_name: values.dataBaseInfo[currentTabIndex].instanceName,
        instance_schema: values.dataBaseInfo[currentTabIndex].instanceSchema,
        sql: sqlStatementInfo.sql,
        input_sql_file: sqlStatementInfo.sqlFile?.[0],
        input_mybatis_xml_file: sqlStatementInfo.mybatisFile?.[0],
        input_zip_file: sqlStatementInfo.zipFile?.[0],
      };

      const res = await task.createAndAuditTaskV1(params);
      if (res.data.code === ResponseCode.SUCCESS && res.data.data) {
        const task = res.data.data;
        const taskId = task.task_id?.toString() ?? '';
        if (catchTaskId.current.has(currentTabKey)) {
          //replace
          const catchId = catchTaskId.current.get(currentTabKey)!;
          const taskIdIndex = catchTaskInfos.current.findIndex(
            (v) => v.task_id?.toString() === catchId
          );
          if (taskIdIndex !== -1) {
            catchTaskInfos.current.splice(taskIdIndex, 1, task);
          }
        } else {
          catchTaskInfos.current.push(task);
        }

        //update catch taskId
        catchTaskId.current.set(currentTabKey, taskId);
        commonJudgeAuditLevel(catchTaskInfos.current);
        setAuditResultActiveKey(task.task_id?.toString() ?? '');
      }
      setTaskInfos(catchTaskInfos.current);
    },
    [commonJudgeAuditLevel, projectName]
  );

  const clearTaskInfoWithKey = (key: string) => {
    if (catchTaskId.current.has(key)) {
      const catchId = catchTaskId.current.get(key)!;
      const taskIdIndex = catchTaskInfos.current.findIndex(
        (v) => v.task_id?.toString() === catchId
      );
      if (taskIdIndex !== -1) {
        catchTaskInfos.current.splice(taskIdIndex, 1);
      }
      setTaskInfos(catchTaskInfos.current);
    }
  };

  const clearDifferenceSqlModeTaskInfos = useCallback(() => {
    catchTaskInfos.current = [];
    catchTaskId.current = new Map([]);
    setTaskInfos([]);
  }, []);

  return {
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
  };
};

export default useAuditOrder;
