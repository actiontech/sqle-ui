import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, List, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import audit_plan from '../../../../../api/audit_plan';
import EmptyBox from '../../../../../components/EmptyBox';
import RuleLevelIcon from '../../../../../components/RuleList/RuleLevelIcon';
import EmitterKey from '../../../../../data/EmitterKey';
import { formatTime } from '../../../../../utils/Common';
import EventEmitter from '../../../../../utils/EventEmitter';
import { floatToPercent } from '../../../../../utils/Math';

const PlanAuditRecord: React.FC<{ auditPlanName: string }> = (props) => {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 10 });

  const { data, loading, refresh } = useRequest(
    () =>
      audit_plan.getAuditPlanReportsV1({
        audit_plan_name: props.auditPlanName,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
      }),
    {
      ready: !!props.auditPlanName,
      refreshDeps: [
        props.auditPlanName,
        pagination.pageIndex,
        pagination.pageSize,
      ],
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data.total_nums ?? 0,
        };
      },
    }
  );

  const pageChange = (current: number, pageSize?: number) => {
    if (
      current !== pagination.pageIndex ||
      (!!pageSize && pageSize !== pagination.pageSize)
    ) {
      setPagination({
        pageIndex: current,
        pageSize: pageSize ?? pagination.pageSize,
      });
    }
  };

  useEffect(() => {
    const refreshEvent = () => {
      refresh();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_Audit_Plan_Record, refreshEvent);
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_Audit_Plan_Record,
        refreshEvent
      );
    };
  }, [refresh]);

  return (
    <Card
      title={
        <Space>
          {t('auditPlan.planTaskRecord.title')}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
    >
      <List
        dataSource={data?.list ?? []}
        pagination={{
          showSizeChanger: true,
          total: data?.total ?? 0,
          onChange: pageChange,
        }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <EmptyBox
                  if={!!item.audit_level}
                  defaultNode={
                    <Space className="flex-all-center" style={{ width: 50 }}>
                      <CheckCircleOutlined
                        className="text-green"
                        style={{
                          fontSize: 25,
                        }}
                      />
                    </Space>
                  }
                >
                  <RuleLevelIcon ruleLevel={item.audit_level} />
                </EmptyBox>
              }
              title={
                <Link
                  to={`/auditPlan/detail/${props.auditPlanName}/report/${item.audit_plan_report_id}`}
                >
                  <span className="text-blue">
                    {`${t('auditPlan.record.generateTime')}${formatTime(
                      item.audit_plan_report_timestamp,
                      '--'
                    )}`}
                  </span>
                </Link>
              }
              description={
                <Space>
                  <Typography.Text type="secondary">
                    {t('audit.source')} {item.score ?? '--'}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {t('audit.passRage')}
                    <EmptyBox if={!!item.pass_rate} defaultNode="--">
                      {floatToPercent(item.pass_rate ?? 0)}%
                    </EmptyBox>
                  </Typography.Text>
                </Space>
              }
            />
          </List.Item>
        )}
      ></List>
    </Card>
  );
};

export default PlanAuditRecord;
