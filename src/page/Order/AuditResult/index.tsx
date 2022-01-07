import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, Space, Switch, Table, Typography } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IAuditTaskSQLResV1 } from '../../../api/common';
import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '../../../api/common.enum';
import instance from '../../../api/instance';
import task from '../../../api/task';
import EmptyBox from '../../../components/EmptyBox';
import useTable from '../../../hooks/useTable';
import { orderAuditResultColumn } from './column';
import FilterForm from './FilterForm';
import { OrderAuditResultFilterFields } from './FilterForm/index.type';
import { AuditResultProps } from './index.type';

export const isExistNotAllowLevel = (
  tableList: IAuditTaskSQLResV1[] | undefined,
  currentLevel: string | undefined
) => {
  if (!tableList || !currentLevel) {
    return false;
  }
  const tableLevelList = tableList.map((v) => v.audit_level).filter((v) => v);
  if (tableLevelList.length === 0) {
    return false;
  }
  const allowLevelList: string[] = [];
  const allLevelList = Object.keys(
    CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
  );
  for (let i = 0; i < allLevelList.length; ++i) {
    const v = allLevelList[i];
    if (v === currentLevel) {
      allowLevelList.push(v);
      break;
    }
    allowLevelList.push(v);
  }
  if (
    new Set([...tableLevelList, ...allowLevelList]).size !==
    allowLevelList.length
  ) {
    return true;
  }
  return false;
};

const AuditResult: React.FC<AuditResultProps> = (props) => {
  const { t } = useTranslation();

  const [duplicate, { toggle: toggleDuplicate }] = useBoolean();

  const {
    filterInfo,
    pagination,
    tableChange,
    filterForm,
    submitFilter,
    resetFilter,
  } = useTable<OrderAuditResultFilterFields>();

  const {
    data: tableData,
    loading,
    run: getAuditTaskSql,
  } = useRequest(
    () =>
      task.getAuditTaskSQLsV1({
        task_id: `${props.taskId}`,
        ...filterInfo,
        page_index: pagination.pageIndex.toString(),
        page_size: pagination.pageSize.toString(),
        no_duplicate: duplicate,
      }),
    {
      manual: true,
      formatResult(res) {
        return {
          list: res.data.data,
          total: res.data.total_nums,
        };
      },
    }
  );

  const {
    loading: getInstanceWorkflowTemplateLoading,
    run: getInstanceWorkflowTemplate,
  } = useRequest(
    () =>
      instance.getInstanceWorkflowTemplateV1({
        instance_name: props.instanceName!,
      }),
    {
      manual: true,
      formatResult(res) {
        return res.data.data?.allow_submit_when_less_audit_level;
      },
    }
  );

  const downloadSql = () => {
    task.downloadAuditTaskSQLFileV1({
      task_id: `${props.taskId}`,
    });
  };

  const downloadReport = () => {
    task.downloadAuditTaskSQLReportV1({
      task_id: `${props.taskId}`,
      no_duplicate: duplicate,
    });
  };

  useEffect(() => {
    if (props.taskId !== undefined) {
      getAuditTaskSql().then((tableData) => {
        if (props.instanceName) {
          getInstanceWorkflowTemplate().then((currentLevel) => {
            isExistNotAllowLevel(tableData?.list, currentLevel) &&
              props.setOperatorOrderBtnDisabled?.();
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination,
    filterInfo,
    duplicate,
    props.taskId,
    getAuditTaskSql,
    props.instanceName,
  ]);

  return (
    <Card
      title={
        <Space>
          {t('audit.result')}
          <Typography.Text type="secondary" className="font-size-small">
            {t('audit.passRage')}
            <EmptyBox if={props.passRate !== undefined}>
              {(props.passRate ?? 0) * 100}%
            </EmptyBox>
          </Typography.Text>
        </Space>
      }
      extra={[
        <Space key="duplicate">
          <Button onClick={downloadReport}>{t('audit.downloadReport')}</Button>
          <Button onClick={downloadSql}>{t('audit.downloadSql')}</Button>
          {t('audit.duplicate')}
          <Switch onChange={toggleDuplicate} />
        </Space>,
      ]}
    >
      <FilterForm form={filterForm} submit={submitFilter} reset={resetFilter} />
      <Table
        rowKey="number"
        loading={loading || getInstanceWorkflowTemplateLoading}
        pagination={{
          total: tableData?.total,
          showSizeChanger: true,
        }}
        columns={orderAuditResultColumn()}
        dataSource={tableData?.list}
        onChange={tableChange}
      />
    </Card>
  );
};

export default AuditResult;
