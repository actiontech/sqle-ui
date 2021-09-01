import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Card, message, Space, Table, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import audit_plan from '../../../../../api/audit_plan';
import { ResponseCode } from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import useTable from '../../../../../hooks/useTable';
import EventEmitter from '../../../../../utils/EventEmitter';
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

  const triggerAudit = () => {
    const hide = message.loading(t('auditPlan.sqlPool.action.loading'), 0);
    audit_plan
      .triggerAuditPlanV1({ audit_plan_name: props.auditPlanName })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('auditPlan.sqlPool.action.triggerSuccess'));
          EventEmitter.emit(EmitterKey.Refresh_Audit_Plan_Record);
        }
      })
      .finally(() => {
        hide();
      });
  };

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
      extra={[
        <Button key="trigger" type="primary" onClick={triggerAudit}>
          {t('auditPlan.sqlPool.action.trigger')}
        </Button>,
      ]}
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
