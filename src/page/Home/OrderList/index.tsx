import { SyncOutlined } from '@ant-design/icons';
import { useTheme } from '@material-ui/styles';
import { useRequest } from 'ahooks';
import { Button, Card, Col, Row, Space, Spin, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import workflow from '../../../api/workflow';
import EmptyBox from '../../../components/EmptyBox';
import { Theme } from '../../../types/theme.type';
import { formatTime } from '../../../utils/Common';
import { OrderListProps } from './index.type';

const OrderList: React.FC<OrderListProps> = (props) => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

  const { data, loading, refresh } = useRequest(
    () =>
      workflow.getWorkflowListV1({
        page_index: 1,
        page_size: 10,
        ...props.requestParams,
      }),
    {
      formatResult(res) {
        return res.data?.data ?? [];
      },
    }
  );

  return (
    <Card
      {...props.cardProps}
      title={
        <Space>
          {props.cardProps?.title}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <EmptyBox
          if={!loading && data && data?.length > 0}
          defaultNode={
            <div className="text-align-center">
              <Typography.Text type="secondary">
                {t('dashboard.order.empty')}
              </Typography.Text>
            </div>
          }
        >
          <Row gutter={theme.common.padding}>
            {data?.map((order) => {
              return (
                <Col
                  span={8}
                  style={{ marginBottom: theme.common.padding }}
                  key={order.workflow_id}
                >
                  <Card
                    title={order.subject}
                    actions={[
                      <Link key="showDetail" to={`/order/${order.workflow_id}`}>
                        <Button type="link">{t('common.showDetail')}</Button>
                      </Link>,
                    ]}
                  >
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 1,
                      }}
                      className="clear-margin"
                    >
                      {t('order.order.createUser')}:{order.create_user_name}
                    </Typography.Paragraph>
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 1,
                      }}
                      className="clear-margin"
                    >
                      {t('order.order.createTime')}:
                      {formatTime(order.create_time)}
                    </Typography.Paragraph>
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 1,
                      }}
                      className="clear-margin"
                    >
                      {t('order.order.desc')}: {order.desc || '--'}
                    </Typography.Paragraph>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </EmptyBox>
      </Spin>
    </Card>
  );
};

export default OrderList;
