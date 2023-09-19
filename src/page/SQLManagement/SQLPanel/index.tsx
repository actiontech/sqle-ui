import { Button, Card, Divider, Space, Table } from 'antd';
import SQLStatistics from './SQLStatistics';

import './index.less';
import FilterForm from './FilterForm';
import { SQLPanelFilterFormFields, SQLStatisticsProps } from './index.type';
import useTable from '../../../hooks/useTable';
import { SQLPanelColumns } from './column';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { useRequest } from 'ahooks';
import SqlManage from '../../../api/SqlManage';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { translateTimeForRequest } from '../../../utils/Common';
import { useState } from 'react';
import { TableRowSelection } from 'antd/lib/table/interface';
import { ISqlManage } from '../../../api/common';
import { useTranslation } from 'react-i18next';
import { expandedRowRender } from '../../Order/AuditResult/column';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

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
  const { username } = useCurrentUser();
  const [SQLNum, setSQLNum] = useState<SQLStatisticsProps>({
    SQLTotalNum: 0,
    problemSQlNum: 0,
    optimizedSQLNum: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: string[]) => {
      setSelectedRowKeys(selectedRowKeys);
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

  //todo
  const batchAssignment = () => {
    refresh();
  };
  const batchSolve = () => {
    refresh();
  };
  const batchIgnore = () => {
    refresh();
  };

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

          <Space>
            <Button
              disabled={selectedRowKeys.length === 0}
              type="primary"
              onClick={batchAssignment}
            >
              {t('sqlManagement.table.actions.batchAssignment')}
            </Button>
            <Button
              disabled={selectedRowKeys.length === 0}
              type="primary"
              onClick={batchSolve}
            >
              {t('sqlManagement.table.actions.batchSolve')}
            </Button>
            <Button
              disabled={selectedRowKeys.length === 0}
              type="primary"
              onClick={batchIgnore}
            >
              {t('sqlManagement.table.actions.batchIgnore')}
            </Button>
          </Space>

          <Table
            className="sql-management-table-namespace"
            onChange={tableChange}
            rowKey={(record: ISqlManage) => {
              return `${record?.id}`;
            }}
            rowSelection={rowSelection as TableRowSelection<ISqlManage>}
            loading={loading}
            dataSource={data?.list}
            columns={SQLPanelColumns({ projectName })}
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
