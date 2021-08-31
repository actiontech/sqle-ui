import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, List, Space } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import audit_plan from '../../../../../api/audit_plan';
import { formatTime } from '../../../../../utils/Common';

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
                  <span className="text-blue">{item.audit_plan_report_id}</span>
                </Link>
              }
              description={`生成时间${formatTime(
                item.audit_plan_report_timestamp,
                '--'
              )}`}
            />
          </List.Item>
        )}
      ></List>
    </Card>
  );
};

export default PlanAuditRecord;
