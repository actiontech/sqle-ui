import { SyncOutlined } from '@ant-design/icons';
import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  PageHeader,
  Space,
  Table,
  Popconfirm,
  message,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import workflow from '../../../api/workflow';
import {
  exportWorkflowV1FilterStatusEnum,
  getWorkflowsV1FilterStatusEnum,
} from '../../../api/workflow/index.enum';
import useTable from '../../../hooks/useTable';
import { translateTimeForRequest } from '../../../utils/Common';
import { orderListColumn } from './column';
import { OrderListUrlParamsKey } from './index.data';
import OrderListFilterForm from './OrderListFilterForm';
import { OrderListFilterFormFields } from './OrderListFilterForm/index.type';
import { IWorkflowDetailResV1 } from '../../../api/common.d';
import useRole from '../../../hooks/useCurrentUser';
import { ResponseCode } from '../../../data/common';
import { Theme } from '../../../types/theme.type';
import { useTheme } from '@material-ui/styles';
import { TableRowSelection } from 'antd/lib/table/interface';
import moment from 'moment';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { WorkflowDetailResV1StatusEnum } from '../../../api/common.enum';
import { Link, useHistory } from 'react-router-dom';
import { IExportWorkflowV1Params } from '../../../api/workflow/index.d';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import EmptyBox from '../../../components/EmptyBox';

const OrderList = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme<Theme>();
  const [resolveUrlParamFlag, setResolveUrlParamFlag] = React.useState(false);
  const { isAdmin } = useRole();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false);
  const [visible, { setTrue: setVisibleTrue, setFalse: setVisibleFalse }] =
    useBoolean(false);

  const { projectName } = useCurrentProjectName();
  const projectIsArchive = useSelector(
    (state: IReduxState) => state.projectManage.archived
  );

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

  const {
    data: orderList,
    loading,
    refresh,
  } = useRequest(
    () => {
      const {
        filter_order_createTime,
        filter_order_executeTime,
        ...otherFilterInfo
      } = filterInfo;
      return workflow
        .getWorkflowsV1({
          project_name: projectName,
          page_index: pagination.pageIndex,
          page_size: pagination.pageSize,
          filter_create_time_from: translateTimeForRequest(
            filter_order_createTime?.[0]
          ),
          filter_create_time_to: translateTimeForRequest(
            filter_order_createTime?.[1]
          ),
          filter_task_execute_start_time_from: translateTimeForRequest(
            filter_order_executeTime?.[0]
          ),
          filter_task_execute_start_time_to: translateTimeForRequest(
            filter_order_executeTime?.[1]
          ),
          ...otherFilterInfo,
        })
        .then((res) => {
          return {
            list: res.data?.data ?? [],
            total: res.data?.total_nums ?? 0,
          };
        });
    },
    {
      ready: resolveUrlParamFlag,
      refreshDeps: [pagination, filterInfo],
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
    if (searchStr.has(OrderListUrlParamsKey.status)) {
      filter.filter_status = searchStr.get(
        OrderListUrlParamsKey.status
      ) as getWorkflowsV1FilterStatusEnum;
    }
    if (searchStr.has(OrderListUrlParamsKey.createUsername)) {
      filter.filter_create_user_name = searchStr.get(
        OrderListUrlParamsKey.createUsername
      ) as string;
    }
    if (searchStr.has(OrderListUrlParamsKey.executeTimeForm)) {
      const executeTimeForm = moment(
        searchStr.get(OrderListUrlParamsKey.executeTimeForm)
      );
      if (!filter.filter_order_executeTime) {
        filter.filter_order_executeTime = [];
      }
      filter.filter_order_executeTime[0] = executeTimeForm;
    }
    if (searchStr.has(OrderListUrlParamsKey.executeTimeTo)) {
      const executeTimeTo = moment(
        searchStr.get(OrderListUrlParamsKey.executeTimeTo)
      );
      if (!filter.filter_order_executeTime) {
        filter.filter_order_executeTime = [];
      }
      filter.filter_order_executeTime[1] = executeTimeTo;
    }
    if (Object.keys(filter).length > 0) {
      collapseChange(false);
      filterForm.setFieldsValue(filter);
      setFilterInfo(filter);
    }
    setResolveUrlParamFlag(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: string[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const batchCancel = React.useCallback(() => {
    const canCancel: boolean = selectedRowKeys.every((e) => {
      const status = orderList?.list.filter(
        (data) => `${data.workflow_id}` === e
      )[0]?.status;
      return (
        status === WorkflowDetailResV1StatusEnum.wait_for_audit ||
        status === WorkflowDetailResV1StatusEnum.wait_for_execution ||
        status === WorkflowDetailResV1StatusEnum.rejected
      );
    });
    if (canCancel) {
      setConfirmLoading(true);
      workflow
        .batchCancelWorkflowsV2({
          workflow_id_list: selectedRowKeys,
          project_name: projectName,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setSelectedRowKeys([]);
            refresh();
          }
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    } else {
      message.warning(
        t('order.batchCancel.messageWarn', {
          process: t('order.status.process'),
          reject: t('order.status.reject'),
        })
      );
    }
    setVisibleFalse();
  }, [
    selectedRowKeys,
    setVisibleFalse,
    orderList?.list,
    projectName,
    refresh,
    t,
  ]);

  // IFTRUE_isEE
  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport },
  ] = useBoolean(false);
  const exportOrder = () => {
    startExport();
    const hideLoading = message.loading(t('order.exportOrder.exporting'));

    const {
      filter_order_createTime,
      filter_order_executeTime,
      filter_create_user_name,
      filter_current_step_assignee_user_name,
      filter_status,
      filter_subject,
      filter_task_instance_name,
    } = filterForm.getFieldsValue();

    const params: IExportWorkflowV1Params = {
      project_name: projectName,
      filter_create_user_name,
      filter_current_step_assignee_user_name,
      filter_status: filter_status as
        | exportWorkflowV1FilterStatusEnum
        | undefined,
      filter_subject,
      filter_task_instance_name,
      filter_create_time_from: translateTimeForRequest(
        filter_order_createTime?.[0]
      ),
      filter_create_time_to: translateTimeForRequest(
        filter_order_createTime?.[1]
      ),
      filter_task_execute_start_time_from: translateTimeForRequest(
        filter_order_executeTime?.[0]
      ),
      filter_task_execute_start_time_to: translateTimeForRequest(
        filter_order_executeTime?.[1]
      ),
    };

    workflow
      .exportWorkflowV1(params, { responseType: 'blob' })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('order.exportOrder.exportSuccessTips'));
        }
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  };
  // FITRUE_isEE

  return (
    <>
      <PageHeader
        title={t('order.orderList.pageTitle')}
        ghost={false}
        extra={[
          <EmptyBox if={!projectIsArchive} key="createOrder">
            <Link to={`/project/${projectName}/order/create`}>
              <Button type="primary">{t('order.createOrder.title')}</Button>
            </Link>
          </EmptyBox>,
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
          <Space
            className="full-width-element"
            direction="vertical"
            size={theme?.common.padding}
          >
            <OrderListFilterForm
              form={filterForm}
              reset={resetFilter}
              submit={submitFilter}
              collapse={collapse}
              collapseChange={collapseChange}
              projectName={projectName}
            />
            <Space>
              {isAdmin && (
                <Popconfirm
                  title={t('order.batchCancel.cancelPopTitle')}
                  okText={t('common.ok')}
                  cancelText={t('common.cancel')}
                  onConfirm={batchCancel}
                  onCancel={() => {
                    setVisibleFalse();
                  }}
                  okButtonProps={{ loading: confirmLoading }}
                  visible={visible}
                >
                  <Button
                    danger
                    disabled={selectedRowKeys?.length === 0}
                    onClick={() => {
                      setVisibleTrue();
                    }}
                  >
                    {t('order.batchCancel.batchDelete')}
                  </Button>
                </Popconfirm>
              )}

              {/* IFTRUE_isEE */}
              <Button
                type="primary"
                onClick={exportOrder}
                disabled={exportButtonDisabled}
              >
                {t('order.exportOrder.buttonText')}
              </Button>
              {/* FITRUE_isEE */}
            </Space>

            <Table
              className="table-row-cursor"
              rowKey={(record: IWorkflowDetailResV1) => {
                return `${record?.workflow_id}`;
              }}
              loading={loading}
              columns={orderListColumn()}
              dataSource={orderList?.list ?? []}
              pagination={{
                total: orderList?.total,
                showSizeChanger: true,
              }}
              onChange={tableChange}
              onRow={(record) => ({
                onClick() {
                  history.push(
                    `/project/${projectName}/order/${record.workflow_id}`
                  );
                },
              })}
              rowSelection={
                isAdmin
                  ? (rowSelection as TableRowSelection<IWorkflowDetailResV1>)
                  : undefined
              }
            />
          </Space>
        </Card>
      </section>
    </>
  );
};

export default OrderList;
