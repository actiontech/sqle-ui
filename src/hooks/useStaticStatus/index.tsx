import { Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAuditTaskSQLsV1FilterAuditStatusEnum,
  getAuditTaskSQLsV1FilterExecStatusEnum,
} from '../../api/task/index.enum';
import {
  getWorkflowListV1FilterCurrentStepTypeEnum,
  getWorkflowsV2FilterStatusEnum,
} from '../../api/workflow/index.enum';
import {
  CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  RuleResV1LevelEnum,
} from '../../api/common.enum';
import {
  auditStatusDictionary,
  execStatusDictionary,
  orderStatusDictionary,
  WorkflowStepTypeDictionary,
  ruleLevelDictionary,
  auditLevelDictionary,
} from './index.data';

const useStaticStatus = () => {
  const { t } = useTranslation();

  const generateExecStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          value={getAuditTaskSQLsV1FilterExecStatusEnum.initialized}
          key={getAuditTaskSQLsV1FilterExecStatusEnum.initialized}
        >
          {t(
            execStatusDictionary[
              getAuditTaskSQLsV1FilterExecStatusEnum.initialized
            ]
          )}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterExecStatusEnum.doing}
          key={getAuditTaskSQLsV1FilterExecStatusEnum.doing}
        >
          {t(
            execStatusDictionary[getAuditTaskSQLsV1FilterExecStatusEnum.doing]
          )}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterExecStatusEnum.succeeded}
          key={getAuditTaskSQLsV1FilterExecStatusEnum.succeeded}
        >
          {t(
            execStatusDictionary[
              getAuditTaskSQLsV1FilterExecStatusEnum.succeeded
            ]
          )}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterExecStatusEnum.failed}
          key={getAuditTaskSQLsV1FilterExecStatusEnum.failed}
        >
          {t(
            execStatusDictionary[getAuditTaskSQLsV1FilterExecStatusEnum.failed]
          )}
        </Select.Option>
      </>
    );
  }, [t]);

  const generateAuditStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          value={getAuditTaskSQLsV1FilterAuditStatusEnum.initialized}
          key={getAuditTaskSQLsV1FilterAuditStatusEnum.initialized}
        >
          {t(
            auditStatusDictionary[
              getAuditTaskSQLsV1FilterAuditStatusEnum.initialized
            ]
          )}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterAuditStatusEnum.doing}
          key={getAuditTaskSQLsV1FilterAuditStatusEnum.doing}
        >
          {t(
            auditStatusDictionary[getAuditTaskSQLsV1FilterAuditStatusEnum.doing]
          )}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterAuditStatusEnum.finished}
          key={getAuditTaskSQLsV1FilterAuditStatusEnum.finished}
        >
          {t(
            auditStatusDictionary[
              getAuditTaskSQLsV1FilterAuditStatusEnum.finished
            ]
          )}
        </Select.Option>
      </>
    );
  }, [t]);

  const generateWorkflowStepTypeSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          key={getWorkflowListV1FilterCurrentStepTypeEnum.sql_review}
          value={getWorkflowListV1FilterCurrentStepTypeEnum.sql_review}
        >
          {t(
            WorkflowStepTypeDictionary[
              getWorkflowListV1FilterCurrentStepTypeEnum.sql_review
            ]
          )}
        </Select.Option>
        <Select.Option
          key={getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute}
          value={getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute}
        >
          {t(
            WorkflowStepTypeDictionary[
              getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute
            ]
          )}
        </Select.Option>
      </>
    );
  }, [t]);

  const generateOrderStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          key={getWorkflowsV2FilterStatusEnum.wait_for_audit}
          value={getWorkflowsV2FilterStatusEnum.wait_for_audit}
        >
          {t(
            orderStatusDictionary[getWorkflowsV2FilterStatusEnum.wait_for_audit]
          )}
        </Select.Option>
        <Select.Option
          key={getWorkflowsV2FilterStatusEnum.wait_for_execution}
          value={getWorkflowsV2FilterStatusEnum.wait_for_execution}
        >
          {t(
            orderStatusDictionary[
              getWorkflowsV2FilterStatusEnum.wait_for_execution
            ]
          )}
        </Select.Option>
        <Select.Option
          key={getWorkflowsV2FilterStatusEnum.executing}
          value={getWorkflowsV2FilterStatusEnum.executing}
        >
          {t(orderStatusDictionary[getWorkflowsV2FilterStatusEnum.executing])}
        </Select.Option>
        <Select.Option
          key={getWorkflowsV2FilterStatusEnum.finished}
          value={getWorkflowsV2FilterStatusEnum.finished}
        >
          {t(orderStatusDictionary[getWorkflowsV2FilterStatusEnum.finished])}
        </Select.Option>
        <Select.Option
          key={getWorkflowsV2FilterStatusEnum.rejected}
          value={getWorkflowsV2FilterStatusEnum.rejected}
        >
          {t(orderStatusDictionary[getWorkflowsV2FilterStatusEnum.rejected])}
        </Select.Option>
        <Select.Option
          key={getWorkflowsV2FilterStatusEnum.exec_failed}
          value={getWorkflowsV2FilterStatusEnum.exec_failed}
        >
          {t(orderStatusDictionary[getWorkflowsV2FilterStatusEnum.exec_failed])}
        </Select.Option>
        <Select.Option
          key={getWorkflowsV2FilterStatusEnum.canceled}
          value={getWorkflowsV2FilterStatusEnum.canceled}
        >
          {t(orderStatusDictionary[getWorkflowsV2FilterStatusEnum.canceled])}
        </Select.Option>
      </>
    );
  }, [t]);

  // const generateSqlTaskStatusSelectOption = React.useCallback(() => {
  //   return (
  //     <>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.initialized}
  //         value={getWorkflowListV1FilterTaskStatusEnum.initialized}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.initialized
  //           ]
  //         )}
  //       </Select.Option>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.audited}
  //         value={getWorkflowListV1FilterTaskStatusEnum.audited}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.audited
  //           ]
  //         )}
  //       </Select.Option>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.executing}
  //         value={getWorkflowListV1FilterTaskStatusEnum.executing}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.executing
  //           ]
  //         )}
  //       </Select.Option>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.exec_succeeded}
  //         value={getWorkflowListV1FilterTaskStatusEnum.exec_succeeded}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.exec_succeeded
  //           ]
  //         )}
  //       </Select.Option>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.exec_failed}
  //         value={getWorkflowListV1FilterTaskStatusEnum.exec_failed}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.exec_failed
  //           ]
  //         )}
  //       </Select.Option>
  //     </>
  //   );
  // }, [t]);

  const getRuleLevelStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          value={RuleResV1LevelEnum.normal}
          key={RuleResV1LevelEnum.normal}
        >
          {t(ruleLevelDictionary[RuleResV1LevelEnum.normal])}
        </Select.Option>
        <Select.Option
          value={RuleResV1LevelEnum.notice}
          key={RuleResV1LevelEnum.notice}
        >
          {t(ruleLevelDictionary[RuleResV1LevelEnum.notice])}
        </Select.Option>
        <Select.Option
          value={RuleResV1LevelEnum.warn}
          key={RuleResV1LevelEnum.warn}
        >
          {t(ruleLevelDictionary[RuleResV1LevelEnum.warn])}
        </Select.Option>
        <Select.Option
          value={RuleResV1LevelEnum.error}
          key={RuleResV1LevelEnum.error}
        >
          {t(ruleLevelDictionary[RuleResV1LevelEnum.error])}
        </Select.Option>
      </>
    );
  }, [t]);

  const getAuditLevelStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          value={
            CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal
          }
          key={
            CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal
          }
        >
          {t(
            auditLevelDictionary[
              CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
                .normal
            ]
          )}
        </Select.Option>
        <Select.Option
          value={
            CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.notice
          }
          key={
            CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.notice
          }
        >
          {t(
            auditLevelDictionary[
              CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
                .notice
            ]
          )}
        </Select.Option>
        <Select.Option
          value={
            CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn
          }
          key={
            CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn
          }
        >
          {t(
            auditLevelDictionary[
              CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn
            ]
          )}
        </Select.Option>
        <Select.Option
          value={
            CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error
          }
          key={
            CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error
          }
        >
          {t(
            auditLevelDictionary[
              CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error
            ]
          )}
        </Select.Option>
      </>
    );
  }, [t]);

  return {
    generateAuditStatusSelectOption,
    generateExecStatusSelectOption,
    generateWorkflowStepTypeSelectOption,
    generateOrderStatusSelectOption,
    // generateSqlTaskStatusSelectOption,
    getRuleLevelStatusSelectOption,
    getAuditLevelStatusSelectOption,
  };
};

export default useStaticStatus;
