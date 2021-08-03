import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, Modal, Space, Table } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import instance from '../../../api/instance';
import { ResponseCode } from '../../../data/common';
import { dataSourceColumns } from './columns';
import DataSourceListFilterForm from './DataSourceListFilterForm';
import { DataSourceListFilterFields } from './DataSourceListFilterForm/index.type';

const DataSourceList = () => {
  const { t } = useTranslation();

  const [filterInfo, setFilterInfo] =
    React.useState<DataSourceListFilterFields>({});

  const {
    data,
    loading,
    pagination: { total },
    refresh,
  } = useRequest(
    ({ current, pageSize }) => {
      return instance.getInstanceListV1({
        page_index: current,
        page_size: pageSize,
        ...filterInfo,
      });
    },
    {
      paginated: true,
      refreshDeps: [filterInfo],
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
    [t]
  );

  const testDatabaseConnection = React.useCallback(
    (instanceName: string) => {
      const hide = message.loading(t('dataSource.dataSourceForm.testing'), 0);
      instance
        .checkInstanceIsConnectableByNameV1({
          instance_name: instanceName,
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
    [t]
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
        <Link to="/data/create">
          <Button type="primary">{t('dataSource.addDatabase')}</Button>
        </Link>
      }
    >
      <DataSourceListFilterForm submit={setFilterInfo} />
      <Table
        rowKey="instance_name"
        loading={loading}
        dataSource={data?.list ?? []}
        columns={dataSourceColumns(deleteDatabase, testDatabaseConnection)}
        pagination={{
          total,
        }}
      />
    </Card>
  );
};

export default DataSourceList;
