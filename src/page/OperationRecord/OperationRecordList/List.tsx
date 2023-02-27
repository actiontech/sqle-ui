import { SyncOutlined } from '@ant-design/icons';
import { useRequest, useBoolean } from 'ahooks';
import { Button, Card, message, Space, Table } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { OperationRecordListFilterFormFields } from '.';
import OperationRecord from '../../../api/OperationRecord';
import { IGetExportOperationRecordListV1Params } from '../../../api/OperationRecord/index.d';
import { ResponseCode } from '../../../data/common';
import useTable from '../../../hooks/useTable';
import { translateTimeForRequest } from '../../../utils/Common';
import OperationRecordListTableHeader from './column';
import FilterForm from './FilterForm';

const OperationRecordList: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm<OperationRecordListFilterFormFields>();

  const { pagination, tableChange, filterInfo, setFilterInfo } =
    useTable<OperationRecordListFilterFormFields>();
  const [
    exportButtonEnableStatus,
    { setFalse: finishExport, setTrue: startExport },
  ] = useBoolean(false);

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

  const exportRecord = () => {
    const values = form.getFieldsValue();
    startExport();
    const hideLoading = message.loading(t('operationRecord.list.exporting'), 0);
    const param: IGetExportOperationRecordListV1Params = {
      filter_operate_action: values?.operationAction,
      filter_operate_project_name: values?.projectName,
      filter_operate_time_from: translateTimeForRequest(
        values?.filterDate?.[0]
      ),
      filter_operate_time_to: translateTimeForRequest(values?.filterDate?.[1]),
      filter_operate_type_name: values.operationType,
      fuzzy_search_operate_user_name: values.operator,
    };
    OperationRecord.getExportOperationRecordListV1(param, {
      responseType: 'blob',
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('operationRecord.list.exportSuccessTips'));
        }
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  };
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
      extra={[
        <Button
          key="export-button"
          type="primary"
          onClick={exportRecord}
          disabled={exportButtonEnableStatus}
        >
          {t('operationRecord.list.exportButtonText')}
        </Button>,
      ]}
    >
      <FilterForm form={form} updateOperationRecordListFilter={setFilterInfo} />
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
