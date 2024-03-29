import { useBoolean } from 'ahooks';
import { Alert, Button, Form, Modal, Space, Spin, Tooltip } from 'antd';
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
  SQLInputType,
  SqlStatementFields,
  SqlStatementForm,
  SqlStatementFormTabs,
  SqlStatementFormTabsRefType,
} from '../../../SqlStatementFormTabs';
import { ModifySqlModalProps } from './index.type';
import {
  FormatLanguageSupport,
  formatterSQL,
} from '../../../../../utils/FormatterSQL';
import { InfoCircleOutlined } from '@ant-design/icons';

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
  const [
    getAllSqlStatementLoading,
    { setTrue: startGetAllSqlStatement, setFalse: finishGetAllSqlStatement },
  ] = useBoolean(false);
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

  const formatSql = async () => {
    const params = await form.getFieldsValue();
    if (sqlMode === WorkflowResV2ModeEnum.same_sqls) {
      const sqlStatementInfo = params['0'] as SqlStatementFields;
      if (sqlStatementInfo?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }
      form.setFields([
        {
          name: ['0', 'sql'],
          value: formatterSQL(
            sqlStatementInfo.sql,
            currentOrderTasks?.[0].instance_db_type
          ),
        },
      ]);
    } else {
      const sqlStatementInfo = params[
        sqlStatementFormTabsRef.current?.activeKey ?? ''
      ] as SqlStatementFields;

      if (sqlStatementInfo?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }
      form.setFields([
        {
          name: [sqlStatementFormTabsRef.current?.activeKey ?? '', 'sql'],
          value: formatterSQL(
            sqlStatementInfo.sql,
            currentOrderTasks[sqlStatementFormTabsRef.current?.activeIndex ?? 0]
              ?.instance_db_type
          ),
        },
      ]);
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

      if (formDataTasks.length > 0) {
        startGetAllSqlStatement();
        Promise.all(
          formDataTasks.map((v) => request(v.task_id?.toString() ?? ''))
        )
          .then((res) => {
            res.forEach((v) => {
              if (v) {
                setSqlStatementValue((sql) => ({ ...sql, [v.taskId]: v.sql }));
              }
            });
          })
          .finally(() => {
            finishGetAllSqlStatement();
          });
      }
    };

    if (visible) {
      getAllSqlStatement();
      if (sqlMode === WorkflowResV2ModeEnum.different_sqls) {
        sqlStatementFormTabsRef.current?.tabsChangeHandle(
          currentOrderTasks[0].task_id?.toString() ?? ''
        );
      }
    } else {
      setSqlStatementValue(undefined);
    }
  }, [
    currentOrderTasks,
    visible,
    sqlMode,
    startGetAllSqlStatement,
    finishGetAllSqlStatement,
    form,
  ]);

  return (
    <Modal
      title={t('order.modifySql.title')}
      width={ModalSize.big}
      open={visible}
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
      <Spin spinning={getAllSqlStatementLoading} delay={400}>
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

          <Form.Item label=" " colon={false} style={{ display: 'inline' }}>
            <Space>
              <Button onClick={formatSql} loading={submitLoading}>
                {t('order.sqlInfo.format')}
              </Button>

              <Tooltip
                overlay={t('order.sqlInfo.formatTips', {
                  supportType: Object.keys(FormatLanguageSupport).join('、'),
                })}
              >
                <InfoCircleOutlined className="text-orange" />
              </Tooltip>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModifySqlModal;
