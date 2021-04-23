import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, PageHeader, Space, Table } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import workflow from '../../../api/workflow';
import {
  getWorkflowListV1FilterCurrentStepTypeEnum,
  getWorkflowListV1FilterStatusEnum,
} from '../../../api/workflow/index.enum';
import useTable from '../../../hooks/useTable';
import { orderListColumn } from './column';
import { OrderListUrlParamsKey } from './index.data';
import OrderListFilterForm from './OrderListFilterForm';
import { OrderListFilterFormFields } from './OrderListFilterForm/index.type';

const OrderList = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();

  const {
    pagination,
    filterForm,
    filterInfo,
    collapse,
    collapseChange,
    resetFilter,
    setFilterInfo,
    submitFilter,
    tableChange,
  } = useTable<OrderListFilterFormFields>();

  const { data: orderList, loading, refresh } = useRequest(
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

  React.useEffect(() => {
    const searchStr = new URLSearchParams(location.search);
    const filter: OrderListFilterFormFields = {};
    if (searchStr.has(OrderListUrlParamsKey.currentStepAssignee)) {
      filter.filter_current_step_assignee_user_name = searchStr.get(
        OrderListUrlParamsKey.currentStepAssignee
      ) as string;
    }
    if (searchStr.has(OrderListUrlParamsKey.currentStepType)) {
      filter.filter_current_step_type = searchStr.get(
        OrderListUrlParamsKey.currentStepType
      ) as getWorkflowListV1FilterCurrentStepTypeEnum;
    }
    if (searchStr.has(OrderListUrlParamsKey.status)) {
      filter.filter_status = searchStr.get(
        OrderListUrlParamsKey.status
      ) as getWorkflowListV1FilterStatusEnum;
    }
    if (Object.keys(filter).length > 0) {
      collapseChange(false);
      filterForm.setFieldsValue(filter);
      setFilterInfo(filter);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Card
          title={
            <Space>
              {t('order.orderList.allOrderAboutMe')}
              <Button onClick={refresh}>
                <SyncOutlined spin={loading} />
              </Button>
            </Space>
          }
        >
          <OrderListFilterForm
            form={filterForm}
            reset={resetFilter}
            submit={submitFilter}
            collapse={collapse}
            collapseChange={collapseChange}
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
