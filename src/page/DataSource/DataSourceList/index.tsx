import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, Modal, Space, Table } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../../api/instance';
import { ResponseCode } from '../../../data/common';
import { dataSourceColumns } from './columns';
import DataSourceListFilterForm from './DataSourceListFilterForm';
import { DataSourceListFilterFields } from './DataSourceListFilterForm/index.type';
import useTable from '../../../hooks/useTable';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import useCurrentUser from '../../../hooks/useCurrentUser';
import EmptyBox from '../../../components/EmptyBox';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import { Link } from '../../../components/Link';

const DataSourceList = () => {
  const { t } = useTranslation();
  const { pagination, filterInfo, setFilterInfo, tableChange } =
    useTable<DataSourceListFilterFields>();
  const { isAdmin, isProjectManager } = useCurrentUser();
  const { projectName } = useCurrentProjectName();
  const projectIsArchive = useSelector(
    (state: IReduxState) => state.projectManage.archived
  );
  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const { data, loading, refresh } = useRequest(
    () => {
      return instance
        .getInstanceListV2({
          project_name: projectName,
          page_index: pagination.pageIndex,
          page_size: pagination.pageSize,
          ...filterInfo,
        })
        .then((res) => {
          return {
            total: res.data?.total_nums ?? 1,
            list: res.data?.data ?? [],
          };
        });
    },
    {
      refreshDeps: [filterInfo, pagination],
    }
  );

  const deleteDatabase = React.useCallback(
    (instanceName: string) => {
      const hideLoading = message.loading(
        t('dataSource.deleteDatabase.deletingDatabase', { name: instanceName }),
        0
      );
      instance
        .deleteInstanceV1({
          instance_name: instanceName,
          project_name: projectName,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(
              t('dataSource.deleteDatabase.deleteSuccessTips', {
                name: instanceName,
              })
            );
            refresh();
          }
        })
        .finally(() => {
          hideLoading();
        });
    },
    [projectName, refresh, t]
  );

  const testDatabaseConnection = React.useCallback(
    (instanceName: string) => {
      const hide = message.loading(t('dataSource.dataSourceForm.testing'), 0);
      instance
        .checkInstanceIsConnectableByNameV1({
          instance_name: instanceName,
          project_name: projectName,
        })
        .then((res) => {
          hide();
          if (res.data.code === ResponseCode.SUCCESS) {
            if (res.data.data?.is_instance_connectable) {
              message.success(t('dataSource.dataSourceForm.testSuccess'));
            } else {
              Modal.error({
                title: t('dataSource.testConnectModal.errorTitle', {
                  instanceName,
                }),
                content:
                  res.data.data?.connect_error_message ??
                  t('common.unknownError'),
              });
            }
          }
        });
    },
    [projectName, t]
  );

  return (
    <Card
      title={
        <Space>
          {t("dataSource.databaseListTitle")}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={
        <EmptyBox if={actionPermission && !projectIsArchive}>
          <Link to={`project/${projectName}/data/create`}>
            <Button type="primary">{t("dataSource.addDatabase")}</Button>
          </Link>
        </EmptyBox>
      }
    >
      <DataSourceListFilterForm
        submit={setFilterInfo}
        projectName={projectName}
      />
      <Table
        rowKey="instance_name"
        loading={loading}
        dataSource={data?.list ?? []}
        columns={dataSourceColumns(
          deleteDatabase,
          testDatabaseConnection,
          projectName,
          actionPermission,
          projectIsArchive
        )}
        pagination={{
          total: data?.total,
          current: pagination.pageIndex,
          pageSize: pagination.pageSize,
        }}
        onChange={tableChange}
      />
    </Card>
  );
};

export default DataSourceList;
