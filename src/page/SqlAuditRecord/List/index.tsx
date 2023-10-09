import { Button, Card, PageHeader, Space, Table, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../components/Link';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { useRequest } from 'ahooks';
import { SQLAuditListFilterFormFields } from './index.type';
import useTable from '../../../hooks/useTable';
import SQLAuditListFilterForm from './FilterForm';
import { SyncOutlined } from '@ant-design/icons';
import { Theme } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import { SQLAuditListColumn } from './column';
import sql_audit_record from '../../../api/sql_audit_record';
import { translateTimeForRequest } from '../../../utils/Common';
import { useCallback, useEffect, useState } from 'react';
import { ResponseCode } from '../../../data/common';

import './index.less';
import { useLocation } from 'react-router-dom';
import { SQLAuditRecordListUrlParamsKey } from './index.data';

const SQLAuditList: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProjectName();
  const theme = useTheme<Theme>();
  const location = useLocation();
  const [resolveUrlParamFlag, setResolveUrlParamFlag] = useState(false);

  const {
    pagination,
    filterForm,
    filterInfo,
    resetFilter,
    submitFilter,
    tableChange,
    setFilterInfo,
  } = useTable<SQLAuditListFilterFormFields>();

  const { data, refresh, loading } = useRequest(
    () =>
      sql_audit_record
        .getSQLAuditRecordsV1({
          page_index: pagination.pageIndex,
          page_size: pagination.pageSize,
          project_name: projectName,
          fuzzy_search_tags: filterInfo.fuzzy_search_tags,
          filter_sql_audit_status: filterInfo.filter_sql_audit_status,
          filter_instance_name: filterInfo.filter_instance_name,
          filter_create_time_from: translateTimeForRequest(
            filterInfo.filter_create_time?.[0]
          ),
          filter_create_time_to: translateTimeForRequest(
            filterInfo.filter_create_time?.[1]
          ),
          filter_sql_audit_record_ids: filterInfo.filter_sql_audit_record_ids,
        })
        .then((res) => {
          return {
            list: res.data?.data ?? [],
            total: res.data?.total_nums ?? 0,
          };
        }),
    {
      ready: resolveUrlParamFlag,
      refreshDeps: [pagination, filterInfo, projectName],
    }
  );

  const updateTags = useCallback(
    async (id: string, tags: string[] = []) => {
      sql_audit_record
        .updateSQLAuditRecordV1({
          tags,
          sql_audit_record_id: id,
          project_name: projectName,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(t('sqlAudit.list.table.updateTagsSuccess'));
            refresh();
          }
        });
    },
    [projectName, refresh, t]
  );

  useEffect(() => {
    const searchStr = new URLSearchParams(location.search);
    const filter: SQLAuditListFilterFormFields = {};
    if (searchStr.has(SQLAuditRecordListUrlParamsKey.SQLAuditRecordID)) {
      filter.filter_sql_audit_record_ids = searchStr.get(
        SQLAuditRecordListUrlParamsKey.SQLAuditRecordID
      ) as string;
    }
    if (Object.keys(filter).length > 0) {
      setFilterInfo(filter);
    }
    setResolveUrlParamFlag(true);
  }, [filterForm, location.search, setFilterInfo]);

  return (
    <>
      <PageHeader
        title={t('sqlAudit.list.title')}
        ghost={false}
        extra={
          <Link to={`project/${projectName}/sqlAudit/create`}>
            <Button type="primary">
              {t('sqlAudit.list.createButtonText')}
            </Button>
          </Link>
        }
      >
        {t('sqlAudit.list.pageDesc')}
      </PageHeader>

      <section className="padding-content">
        <Card
          title={
            <Space>
              {t('sqlAudit.list.table.title')}
              <Button onClick={refresh}>
                <SyncOutlined spin={loading} />
              </Button>
            </Space>
          }
        >
          <Space
            className="full-width-element"
            direction="vertical"
            size={theme?.common.padding}
          >
            <SQLAuditListFilterForm
              form={filterForm}
              reset={resetFilter}
              submit={submitFilter}
              projectName={projectName}
            />
            <Table
              dataSource={data?.list}
              loading={loading}
              onChange={tableChange}
              columns={SQLAuditListColumn(projectName, updateTags)}
              pagination={{
                total: data?.total,
                showSizeChanger: true,
              }}
              scroll={{
                x: 'max-content',
              }}
            />
          </Space>
        </Card>
      </section>
    </>
  );
};

export default SQLAuditList;
