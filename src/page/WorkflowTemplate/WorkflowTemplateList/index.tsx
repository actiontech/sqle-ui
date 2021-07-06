import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import workflow from '../../../api/workflow';
import { ResponseCode } from '../../../data/common';
import useTable from '../../../hooks/useTable';
import { workflowTemplateListColumn } from './tableColumns';

const WorkflowTemplateList = () => {
  const { t } = useTranslation();

  const history = useHistory();
  const { pagination, tableChange } = useTable();

  const { data, loading, refresh } = useRequest(
    () =>
      workflow.getWorkflowTemplateListV1({
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
      }),
    {
      refreshDeps: [pagination],
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      },
    }
  );

  const deleteTemplate = (workflowTemplateName: string) => {
    const hide = message.loading({
      duration: 0,
      content: t('workflowTemplate.delete.deleting', {
        name: workflowTemplateName,
      }),
    });
    workflow
      .deleteWorkflowTemplateV1({
        workflow_template_name: workflowTemplateName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success({
            content: t('workflowTemplate.delete.successTips', {
              name: workflowTemplateName,
            }),
          });
          refresh();
        }
      })
      .finally(() => {
        hide();
      });
  };

  return (
    <article>
      <Card
        title={
          <Space>
            {t('workflowTemplate.list.title.listTable')}
            <Button onClick={refresh}>
              <SyncOutlined spin={loading} />
            </Button>
          </Space>
        }
        extra={[
          <Link key="create-workflow-template" to="/progress/create">
            <Button type="primary">
              {t('workflowTemplate.list.operator.create')}
            </Button>
          </Link>,
        ]}
      >
        <Table
          loading={loading}
          className="table-row-cursor"
          pagination={{
            total: data?.total,
            showSizeChanger: true,
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                history.push(
                  `/progress/detail/${record.workflow_template_name}`
                );
              },
            };
          }}
          rowKey="workflow_template_name"
          dataSource={data?.list}
          columns={workflowTemplateListColumn(deleteTemplate)}
          onChange={tableChange}
        />
      </Card>
    </article>
  );
};

export default WorkflowTemplateList;
