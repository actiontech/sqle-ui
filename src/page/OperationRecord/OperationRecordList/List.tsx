import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { OperationRecordListFilterFormFields } from '.';
import OperationRecord from '../../../api/OperationRecord';
import useTable from '../../../hooks/useTable';
import { translateTimeForRequest } from '../../../utils/Common';
import OperationRecordListTableHeader from './column';
import FilterForm from './FilterForm';

const OperationRecordList: React.FC = () => {
  const { t } = useTranslation();

  const { pagination, tableChange, filterInfo, setFilterInfo } =
    useTable<OperationRecordListFilterFormFields>();

  const { loading, data, refresh } = useRequest(
    () =>
      OperationRecord.getOperationRecordListV1({
        filter_operate_action: filterInfo?.operationAction,
        filter_operate_project_name: filterInfo?.projectName,
        filter_operate_time_from: translateTimeForRequest(
          filterInfo?.filterDate?.[0]
        ),
        filter_operate_time_to: translateTimeForRequest(
          filterInfo?.filterDate?.[1]
        ),
        filter_operate_type_name: filterInfo.operationType,
        fuzzy_search_operate_user_name: filterInfo.operator,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
      }),
    {
      paginated: true,
      refreshDeps: [pagination, filterInfo],
      formatResult(res) {
        return {
          total: res.data.total_nums ?? 0,
          list: res.data?.data ?? [],
        };
      },
    }
  );

  //todo
  // const exportRecord = () => {};
  return (
    <Card
      title={
        <Space>
          {t('operationRecord.list.title')}
          <Button data-testid="refresh-table" onClick={refresh}>
            <SyncOutlined spin={false} />
          </Button>
        </Space>
      }
      // extra={[
      //   <Button type="primary" onClick={exportRecord}>
      //     {t('operationRecord.list.exportButtonText')}
      //   </Button>,
      // ]}
    >
      <FilterForm updateOperationRecordListFilter={setFilterInfo} />
      <Table
        rowKey="id"
        columns={OperationRecordListTableHeader()}
        dataSource={data?.list}
        pagination={{
          total: data?.total,
          showSizeChanger: true,
        }}
        loading={loading}
        onChange={tableChange}
      />
    </Card>
  );
};

export default OperationRecordList;
