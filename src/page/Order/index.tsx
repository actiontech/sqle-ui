import { useTheme } from '@material-ui/styles';
import { useRequest } from 'ahooks';
import { Card, Descriptions, PageHeader, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import task from '../../api/task';
import workflow from '../../api/workflow';
import EmptyBox from '../../components/EmptyBox';
import OrderStatusTag from '../../components/OrderStatusTag';
import { Theme } from '../../types/theme.type';
import { formatTime } from '../../utils/Common';
import AuditResult from './AuditResult';
import OrderSteps from './OrderSteps';

const Order = () => {
  const urlParams = useParams<{ orderId: string }>();
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

  const { data: orderInfo } = useRequest(
    () =>
      workflow.getWorkflowV1({
        workflow_id: Number.parseInt(urlParams.orderId),
      }),
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  const { data: taskInfo } = useRequest(
    () => task.getAuditTaskV1({ task_id: `${orderInfo?.task_id}` }),
    {
      ready: !!orderInfo,
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  return (
    <>
      <PageHeader
        title={
          <Space>
            {t('order.pageTitle')}
            <OrderStatusTag status={orderInfo?.status} />
          </Space>
        }
        ghost={false}
      >
        <Descriptions>
          <Descriptions.Item label={t('order.order.name')}>
            {orderInfo?.subject ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('order.order.createUser')}>
            {orderInfo?.create_user_name}
          </Descriptions.Item>
          <Descriptions.Item label={t('order.order.createTime')}>
            {formatTime(orderInfo?.create_time)}
          </Descriptions.Item>
          <Descriptions.Item label={t('order.order.desc')} span={3}>
            {orderInfo?.desc || '--'}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <section className="padding-content">
        <Space
          className="full-width-element"
          direction="vertical"
          size={theme.common.padding}
        >
          <AuditResult
            taskId={orderInfo?.task_id}
            passRate={taskInfo?.pass_rate}
          />
          <EmptyBox if={!!orderInfo}>
            <Card title={t('order.operator.title')}>
              <OrderSteps
                stepList={orderInfo?.workflow_step_list ?? []}
                currentStep={orderInfo?.current_step_number}
                createUser={orderInfo?.create_user_name}
                createTime={formatTime(orderInfo?.create_time)}
                pass={() => void 0}
                reject={() => void 0}
              />
            </Card>
          </EmptyBox>
        </Space>
      </section>
    </>
  );
};

export default Order;
