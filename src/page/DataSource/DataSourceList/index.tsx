import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, Modal, Space, Table } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../../api/instance';
import { ResponseCode } from '../../../data/common';
import { dataSourceColumns } from './columns';
import DataSourceListFilterForm from './DataSourceListFilterForm';
import { DataSourceListFilterFields } from './DataSourceListFilterForm/index.type';
import useTable from '../../../hooks/useTable';
import {
  CustomLink,
  useCurrentProjectName,
} from '../../ProjectManage/ProjectDetail';

const DataSourceList = () => {
  const { t } = useTranslation();

  const { pagination, filterInfo, setFilterInfo, tableChange } =
    useTable<DataSourceListFilterFields>();
  const { projectName } = useCurrentProjectName();
  const { data, loading, refresh } = useRequest(
    () => {
      return instance.getInstanceListV1({
        project_name: projectName,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
        ...filterInfo,
      });
    },
    {
      paginated: true,
      refreshDeps: [filterInfo, pagination],
      formatResult(res) {
        return {
          total: res.data?.total_nums ?? 1,
          list: res.data?.data ?? [],
        };
      },
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
          }
        })
        .finally(() => {
          hideLoading();
        });
    },
    [projectName, t]
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
          {t('dataSource.databaseListTitle')}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={
        <CustomLink to="/data/create" projectName={projectName}>
          <Button type="primary">{t('dataSource.addDatabase')}</Button>
        </CustomLink>
      }
    >
      <DataSourceListFilterForm submit={setFilterInfo} />
      <Table
        rowKey="instance_name"
        loading={loading}
        dataSource={data?.list ?? []}
        columns={dataSourceColumns(
          deleteDatabase,
          testDatabaseConnection,
          projectName
        )}
        pagination={{
          total: data?.total,
        }}
        onChange={tableChange}
      />
    </Card>
  );
};

export default DataSourceList;
