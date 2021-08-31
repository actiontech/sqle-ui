import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Card, Space, Table } from 'antd';
import { Button } from 'antd/lib/radio';
import { useTranslation } from 'react-i18next';
import audit_plan from '../../../../../api/audit_plan';
import useTable from '../../../../../hooks/useTable';
import { SqlPoolTableHeader } from './tableHeader';

const SqlPool: React.FC<{ auditPlanName: string }> = (props) => {
  const { t } = useTranslation();

  const { pagination, tableChange } = useTable();

  const { loading, data, refresh } = useRequest(
    () =>
      audit_plan.getAuditPlanSQLsV1({
        audit_plan_name: props.auditPlanName,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
      }),
    {
      ready: !!props.auditPlanName,
      refreshDeps: [props.auditPlanName, pagination],
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      },
    }
  );

  return (
    <Card
      title={
        <Space>
          {t('auditPlan.sqlPool.title')}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
    >
      <Table
        rowKey="audit_plan_sql_fingerprint"
        pagination={{
          total: data?.total ?? 0,
          showSizeChanger: true,
        }}
        dataSource={data?.list ?? []}
        columns={SqlPoolTableHeader()}
        loading={loading}
        onChange={tableChange}
      />
    </Card>
  );
};

export default SqlPool;
