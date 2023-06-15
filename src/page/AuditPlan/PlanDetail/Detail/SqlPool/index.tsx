import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Card, message, Space, Table, Button } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import audit_plan from '../../../../../api/audit_plan';
import { IAuditPlanSQLHeadV1 } from '../../../../../api/common';
import { AuditPlanSQLHeadV1TypeEnum } from '../../../../../api/common.enum';
import EmptyBox from '../../../../../components/EmptyBox';
import { ResponseCode } from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import useTable from '../../../../../hooks/useTable';
import EventEmitter from '../../../../../utils/EventEmitter';
import HighlightCode from '../../../../../utils/HighlightCode';
import { formatTime } from '../../../../../utils/Common';

const SqlPool: React.FC<{
  auditPlanName: string;
  projectName: string;
  projectIsArchive: boolean;
}> = (props) => {
  const { t } = useTranslation();

  const { pagination, tableChange } = useTable();

  const [columns, setColumns] = useState<ColumnType<any>[]>([]);
  const { loading, data, refresh } = useRequest(
    () =>
      audit_plan
        .getAuditPlanSQLsV1({
          project_name: props.projectName,
          audit_plan_name: props.auditPlanName,
          page_index: pagination.pageIndex,
          page_size: pagination.pageSize,
        })
        .then((res) => {
          return {
            head: res.data.data?.head,
            list: res.data.data?.rows,
            total: res.data.total_nums,
          };
        }),
    {
      ready: !!props.auditPlanName,
      refreshDeps: [props.auditPlanName, pagination],

      onSuccess: (res) => {
        const { head = [] } = res;
        setColumns(
          (head as IAuditPlanSQLHeadV1[]).map((item) => ({
            title: item.desc,
            dataIndex: item.name,
            render: (text) => {
              if (item.type === AuditPlanSQLHeadV1TypeEnum.sql) {
                return (
                  <pre
                    dangerouslySetInnerHTML={{
                      __html: HighlightCode.highlightSql(text),
                    }}
                    className="pre-warp-break-all"
                  ></pre>
                );
              }
              if (item.name === 'last_receive_timestamp') {
                return formatTime(text);
              }
              return text;
            },
          }))
        );
      },
    }
  );

  const triggerAudit = () => {
    const hide = message.loading(t('auditPlan.sqlPool.action.loading'), 0);
    audit_plan
      .triggerAuditPlanV1({
        audit_plan_name: props.auditPlanName,
        project_name: props.projectName,
      })
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
        <EmptyBox if={!props.projectIsArchive} key="trigger">
          <Button type="primary" onClick={triggerAudit}>
            {t('auditPlan.sqlPool.action.trigger')}
          </Button>
        </EmptyBox>,
      ]}
    >
      <Table
        pagination={{
          total: data?.total ?? 0,
          showSizeChanger: true,
        }}
        dataSource={data?.list ?? []}
        columns={columns}
        loading={loading}
        onChange={tableChange}
      />
    </Card>
  );
};

export default SqlPool;
