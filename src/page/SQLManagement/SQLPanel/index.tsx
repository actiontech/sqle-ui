import { Button, Card, Divider, Popconfirm, Space, Table, message } from 'antd';
import SQLStatistics from './SQLStatistics';

import './index.less';
import FilterForm from './FilterForm';
import { SQLPanelFilterFormFields, SQLStatisticsProps } from './index.type';
import useTable from '../../../hooks/useTable';
import { SQLPanelColumns } from './column';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { useBoolean, useRequest } from 'ahooks';
import SqlManage from '../../../api/SqlManage';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { translateTimeForRequest } from '../../../utils/Common';
import { useCallback, useRef, useState } from 'react';
import { TableRowSelection } from 'antd/lib/table/interface';
import { ISqlManage } from '../../../api/common';
import { useTranslation } from 'react-i18next';
import { expandedRowRender } from '../../Order/AuditResult/column';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import EmptyBox from '../../../components/EmptyBox';
import { BatchUpdateSqlManageReqStatusEnum } from '../../../api/common.enum';
import { ResponseCode } from '../../../data/common';
import AssignMember from './AssignMember';

const SQLPanel: React.FC = () => {
  const { t } = useTranslation();
  const {
    pagination,
    filterForm,
    filterInfo,
    resetFilter,
    submitFilter,
    tableChange,
  } = useTable<SQLPanelFilterFormFields>();
  const { projectName } = useCurrentProjectName();
  const { username, isAdmin, isProjectManager } = useCurrentUser();
  const [SQLNum, setSQLNum] = useState<SQLStatisticsProps>({
    SQLTotalNum: 0,
    problemSQlNum: 0,
    optimizedSQLNum: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);
  const [
    batchActionsLoading,
    { setFalse: finishBatchAction, setTrue: startBatchAction },
  ] = useBoolean();
  const [
    signalActionsLoading,
    { setFalse: finishSignalAction, setTrue: startSignalAction },
  ] = useBoolean();

  const rowSelection: TableRowSelection<ISqlManage> = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys as number[]);
    },
  };

  const { data, loading, refresh } = useRequest(
    () =>
      SqlManage.GetSqlManageList({
        project_name: projectName,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
        filter_assignee: !!filterInfo.filter_assignee ? username : undefined,
        filter_last_audit_start_time_from: translateTimeForRequest(
          filterInfo.filter_last_audit_time?.[0]
        ),
        filter_last_audit_start_time_to: translateTimeForRequest(
          filterInfo.filter_last_audit_time?.[1]
        ),

        fuzzy_search_sql_fingerprint: filterInfo.fuzzy_search_sql_fingerprint,
        filter_instance_name: filterInfo.filter_instance_name,
        filter_status: filterInfo.filter_status,
        filter_source: filterInfo.filter_source,
        filter_audit_level: filterInfo.filter_audit_level,
      }).then((res) => {
        setSQLNum({
          SQLTotalNum: res.data?.sql_manage_total_num ?? 0,
          problemSQlNum: res.data?.sql_manage_bad_num ?? 0,
          optimizedSQLNum: res.data?.sql_manage_optimized_num ?? 0,
        });
        return {
          list: res.data?.data ?? [],
          total: res.data?.sql_manage_total_num ?? 0,
        };
      }),
    {
      refreshDeps: [pagination, filterInfo],
    }
  );

  const batchAssignment = (members: string[]) => {
    if (!actionPermission || selectedRowKeys.length === 0) {
      return;
    }
    startBatchAction();
    return SqlManage.BatchUpdateSqlManage({
      project_name: projectName,
      sql_manage_id_list: selectedRowKeys,
      assignees: members,
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('sqlManagement.table.actions.batchAssignmentSuccessTips')
          );
          setSelectedRowKeys([]);
          refresh();
        }
      })
      .finally(() => {
        finishBatchAction();
      });
  };

  const batchSolve = () => {
    if (!actionPermission || selectedRowKeys.length === 0) {
      return;
    }
    startBatchAction();
    SqlManage.BatchUpdateSqlManage({
      project_name: projectName,
      status: BatchUpdateSqlManageReqStatusEnum.solved,
      sql_manage_id_list: selectedRowKeys,
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('sqlManagement.table.actions.batchSolveSuccessTips')
          );
          setSelectedRowKeys([]);
          refresh();
        }
      })
      .finally(() => {
        finishBatchAction();
      });
  };
  const batchIgnore = () => {
    if (!actionPermission || selectedRowKeys.length === 0) {
      return;
    }
    startBatchAction();
    SqlManage.BatchUpdateSqlManage({
      project_name: projectName,
      status: BatchUpdateSqlManageReqStatusEnum.ignored,
      sql_manage_id_list: selectedRowKeys,
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('sqlManagement.table.actions.batchIgnoreSuccessTips')
          );
          setSelectedRowKeys([]);
          refresh();
        }
      })
      .finally(() => {
        finishBatchAction();
      });
  };

  const updateRemarkProtect = useRef(false);

  const updateRemark = useCallback(
    (id: number, remark: string) => {
      if (updateRemarkProtect.current || !actionPermission) {
        return;
      }
      updateRemarkProtect.current = true;
      SqlManage.BatchUpdateSqlManage({
        project_name: projectName,
        sql_manage_id_list: [id],
        remark,
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            refresh();
          }
        })
        .finally(() => {
          updateRemarkProtect.current = false;
        });
    },
    [actionPermission, projectName, refresh]
  );

  const updateSQLStatus = useCallback(
    (id: number, status: BatchUpdateSqlManageReqStatusEnum) => {
      if (!actionPermission) {
        return;
      }
      startSignalAction();
      return SqlManage.BatchUpdateSqlManage({
        project_name: projectName,
        sql_manage_id_list: [id],
        status,
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(
              t('sqlManagement.table.actions.signalUpdateStatusSuccessTips')
            );
            refresh();
          }
        })
        .finally(() => {
          finishSignalAction();
        });
    },
    [
      actionPermission,
      finishSignalAction,
      projectName,
      refresh,
      startSignalAction,
      t,
    ]
  );

  const signalAssignment = useCallback(
    (id: number, members: string[]) => {
      if (!actionPermission) {
        return;
      }
      startSignalAction();
      return SqlManage.BatchUpdateSqlManage({
        project_name: projectName,
        sql_manage_id_list: [id],
        assignees: members,
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(
              t('sqlManagement.table.actions.signalAssignmentSuccessTips')
            );
            refresh();
          }
        })
        .finally(() => {
          finishSignalAction();
        });
    },
    [
      actionPermission,
      finishSignalAction,
      projectName,
      refresh,
      startSignalAction,
      t,
    ]
  );

  return (
    <section className="padding-content">
      <Card>
        <Space direction="vertical" size={16} className="full-width-element">
          <SQLStatistics {...SQLNum} />

          <FilterForm
            form={filterForm}
            reset={resetFilter}
            submit={submitFilter}
            projectName={projectName}
          />

          <Divider style={{ margin: 0 }} />

          <EmptyBox if={actionPermission}>
            <Space>
              <AssignMember
                disabled={selectedRowKeys.length === 0 || batchActionsLoading}
                projectName={projectName}
                onConfirm={batchAssignment}
              >
                <Button
                  disabled={selectedRowKeys.length === 0 || batchActionsLoading}
                  type="primary"
                >
                  {t('sqlManagement.table.actions.batchAssignment')}
                </Button>
              </AssignMember>

              <Popconfirm
                title={t('sqlManagement.table.actions.batchSolveTips')}
                placement="topLeft"
                okText={t('common.ok')}
                disabled={selectedRowKeys.length === 0 || batchActionsLoading}
                onConfirm={batchSolve}
              >
                <Button
                  disabled={selectedRowKeys.length === 0 || batchActionsLoading}
                  type="primary"
                >
                  {t('sqlManagement.table.actions.batchSolve')}
                </Button>
              </Popconfirm>
              <Popconfirm
                title={t('sqlManagement.table.actions.batchIgnoreTips')}
                placement="topLeft"
                okText={t('common.ok')}
                disabled={selectedRowKeys.length === 0 || batchActionsLoading}
                onConfirm={batchIgnore}
              >
                <Button
                  disabled={selectedRowKeys.length === 0 || batchActionsLoading}
                  type="primary"
                >
                  {t('sqlManagement.table.actions.batchIgnore')}
                </Button>
              </Popconfirm>
            </Space>
          </EmptyBox>

          <Table
            className="sql-management-table-namespace"
            onChange={tableChange}
            rowKey={(record: ISqlManage) => {
              return record?.id ?? 0;
            }}
            rowSelection={actionPermission ? rowSelection : undefined}
            loading={loading}
            dataSource={data?.list}
            columns={SQLPanelColumns({
              projectName,
              updateRemark,
              signalAssignment,
              signalActionsLoading,
              actionPermission,
              username,
              updateSQLStatus,
            })}
            pagination={{
              showSizeChanger: true,
              total: data?.total ?? 0,
            }}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) =>
                !!record.audit_result && record.audit_result.length > 1,
              expandIcon: ({ expanded, onExpand, record }) =>
                !!record.audit_result && record.audit_result.length > 1 ? (
                  expanded ? (
                    <UpOutlined onClick={(e) => onExpand(record, e)} />
                  ) : (
                    <DownOutlined onClick={(e) => onExpand(record, e)} />
                  )
                ) : null,
              columnWidth: 14,
            }}
            scroll={{ x: 'max-content' }}
          />
        </Space>
      </Card>
    </section>
  );
};

export default SQLPanel;
