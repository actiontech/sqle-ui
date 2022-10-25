import { useBoolean } from 'ahooks';
import { Alert, Button, Form, Modal, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AuditTaskResV1SqlSourceEnum,
  WorkflowResV2ModeEnum,
} from '../../../../../api/common.enum';
import task from '../../../../../api/task';

import EmptyBox from '../../../../../components/EmptyBox';
import {
  ModalFormLayout,
  ModalSize,
  ResponseCode,
} from '../../../../../data/common';
import { DatabaseInfoFields } from '../../../Create/SqlInfoForm/index.type';
import {
  SqlStatementFields,
  SqlStatementForm,
  SqlStatementFormTabs,
  SqlStatementFormTabsRefType,
} from '../../../SqlStatementFormTabs';
import { ModifySqlModalProps } from './index.type';

const ModifySqlModal: React.FC<ModifySqlModalProps> = ({
  currentOrderTasks = [],
  sqlMode,
  submit,
  visible,
  cancel,
}) => {
  const { t } = useTranslation();
  const [form] = useForm<{ [key in string]: SqlStatementFields }>();
  const sqlStatementFormTabsRef = useRef<SqlStatementFormTabsRefType>(null);

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [sqlStatementValue, setSqlStatementValue] =
    useState<Record<string, string>>();

  const sqlStatementInfo = useMemo(() => {
    return currentOrderTasks.map((v) => {
      return {
        key: v.task_id?.toString() ?? '',
        instanceName: v.instance_name ?? '',
        sql: sqlStatementValue?.[v.task_id?.toString() ?? ''],
      };
    });
  }, [currentOrderTasks, sqlStatementValue]);

  const auditSql = async () => {
    startSubmit();
    try {
      const sqlStatementInfo = await form.validateFields();
      const currentTabIndex = sqlStatementFormTabsRef.current?.activeIndex ?? 0;
      const currentTabKey = sqlStatementFormTabsRef.current?.activeKey ?? '';
      const dataBaseInfo: Array<DatabaseInfoFields> =
        currentOrderTasks.map((v) => ({
          instanceName: v.instance_name ?? '',
          instanceSchema: v.instance_schema ?? '',
        })) ?? [];
      await submit(
        {
          ...sqlStatementInfo,
          dataBaseInfo,
          isSameSqlOrder: sqlMode === WorkflowResV2ModeEnum.same_sqls,
        },
        currentTabIndex,
        currentTabKey
      );
    } finally {
      submitFinish();
    }
  };

  useEffect(() => {
    const getAllSqlStatement = () => {
      const request = (taskId: string) => {
        return task
          .getAuditTaskSQLContentV1({
            task_id: taskId,
          })
          .then((res) => {
            if (res.data.code === ResponseCode.SUCCESS) {
              return {
                taskId,
                sql: res.data.data?.sql ?? '',
              };
            }
          });
      };

      const formDataTasks = currentOrderTasks.filter(
        (v) => v.sql_source === AuditTaskResV1SqlSourceEnum.form_data
      );
      Promise.all(
        formDataTasks.map((v) => request(v.task_id?.toString() ?? ''))
      ).then((res) => {
        res.forEach((v) => {
          if (v) {
            setSqlStatementValue((sql) => ({ ...sql, [v.taskId]: v.sql }));
          }
        });
      });
    };

    if (visible) {
      getAllSqlStatement();
      if (sqlMode === WorkflowResV2ModeEnum.different_sqls) {
        sqlStatementFormTabsRef.current?.tabsChangeHandle(
          currentOrderTasks[0].task_id?.toString() ?? ''
        );
      }
    }
  }, [currentOrderTasks, visible, sqlMode]);

  return (
    <Modal
      title={t('order.modifySql.title')}
      width={ModalSize.big}
      visible={visible}
      closable={false}
      footer={
        <Space>
          <Alert message={t('order.modifySql.submitTips')} type="warning" />
          <Button onClick={cancel} disabled={submitLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={auditSql} loading={submitLoading}>
            {t('common.submit')}
          </Button>
        </Space>
      }
    >
      <Form form={form} {...ModalFormLayout}>
        <EmptyBox
          if={sqlMode === WorkflowResV2ModeEnum.different_sqls}
          defaultNode={
            <SqlStatementForm
              form={form}
              sqlStatement={
                sqlStatementValue?.[currentOrderTasks[0]?.task_id ?? '']
              }
              hideUpdateMybatisFile={true}
            />
          }
        >
          <SqlStatementFormTabs
            ref={sqlStatementFormTabsRef}
            form={form}
            sqlStatementInfo={sqlStatementInfo}
            hideUpdateMybatisFile={true}
          />
        </EmptyBox>
      </Form>
    </Modal>
  );
};

export default ModifySqlModal;
