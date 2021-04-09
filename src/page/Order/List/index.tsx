import { useRequest } from 'ahooks';
import { Button, Card, PageHeader, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import workflow from '../../../api/workflow';
import useTable from '../../../hooks/useTable';
import { orderListColumn } from './column';
import OrderListFilterForm from './OrderListFilterForm';
import { OrderListFilterFormFields } from './OrderListFilterForm/index.type';

const OrderList = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const {
    pagination,
    filterForm,
    filterInfo,
    resetFilter,
    submitFilter,
    tableChange,
  } = useTable<OrderListFilterFormFields>();

  const { data: orderList, loading } = useRequest(
    () =>
      workflow.getWorkflowListV1({
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
        ...filterInfo,
      }),
    {
      refreshDeps: [pagination, filterInfo],
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      },
    }
  );

  return (
    <>
      <PageHeader
        title={t('order.orderList.pageTitle')}
        ghost={false}
        extra={[
          <Link to="/order/create" key="createOrder">
            <Button type="primary">{t('order.createOrder.title')}</Button>
          </Link>,
        ]}
      >
        {t('order.orderList.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Card title={t('order.orderList.allOrderAboutMe')}>
          <OrderListFilterForm
            form={filterForm}
            reset={resetFilter}
            submit={submitFilter}
          />
          <Table
            className="table-row-cursor"
            rowKey="workflow_id"
            loading={loading}
            columns={orderListColumn()}
            dataSource={orderList?.list}
            pagination={{
              total: orderList?.total,
              showSizeChanger: true,
            }}
            onChange={tableChange}
            onRow={(record) => ({
              onClick() {
                history.push(`/order/${record.workflow_id}`);
              },
            })}
          />
        </Card>
      </section>
    </>
  );
};

export default OrderList;
