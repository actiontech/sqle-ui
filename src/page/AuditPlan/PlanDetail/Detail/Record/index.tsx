import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, List, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import audit_plan from '../../../../../api/audit_plan';
import { AuditPlanReportResV1AuditLevelEnum } from '../../../../../api/common.enum';
import EmptyBox from '../../../../../components/EmptyBox';
import EmitterKey from '../../../../../data/EmitterKey';
import { auditPlanRuleLevelDictionary } from '../../../../../hooks/useStaticStatus/index.data';
import { formatTime } from '../../../../../utils/Common';
import EventEmitter from '../../../../../utils/EventEmitter';

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
                <>
                  <Space>
                    <Typography.Text type="secondary">
                      {t('audit.source')} {item.score}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {t('audit.passRage')}
                      {(item.pass_rate ?? 0) * 100}%
                    </Typography.Text>
                  </Space>
                  <div>
                    <EmptyBox if={!!item.audit_level}>
                      <Typography.Text type="secondary">
                        {t('auditPlan.record.highRuleLevel')}:
                        {t(
                          auditPlanRuleLevelDictionary[
                            item.audit_level as AuditPlanReportResV1AuditLevelEnum
                          ]
                        )}
                      </Typography.Text>
                    </EmptyBox>
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      ></List>
    </Card>
  );
};

export default PlanAuditRecord;
