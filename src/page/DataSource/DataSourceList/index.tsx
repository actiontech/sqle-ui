import { useRequest } from 'ahooks';
import { Button, Card, message, Table } from 'antd';
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

  const [
    filterInfo,
    setFilterInfo,
  ] = React.useState<DataSourceListFilterFields>({});

  const {
    data,
    loading,
    pagination: { total },
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

  return (
    <Card
      title={t('dataSource.databaseListTitle')}
      extra={
        <Link to="/data/add">
          <Button type="primary">{t('dataSource.addDatabase')}</Button>
        </Link>
      }
    >
      <DataSourceListFilterForm submit={setFilterInfo} />
      <Table
        loading={loading}
        dataSource={data?.list ?? []}
        columns={dataSourceColumns(deleteDatabase)}
        pagination={{
          total,
        }}
      />
    </Card>
  );
};

export default DataSourceList;
