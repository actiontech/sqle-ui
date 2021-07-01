import { Popconfirm, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IWorkflowTemplateResV1 } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';

export const workflowTemplateListColumn = (
  deleteTemplate: (templateName: string) => void
): TableColumn<IWorkflowTemplateResV1, 'operator'> => {
  return [
    {
      dataIndex: 'workflow_template_name',
      title: () => i18n.t('workflowTemplate.list.table.workflowTemplateName'),
    },
    {
      dataIndex: 'desc',
      title: () => i18n.t('workflowTemplate.list.table.desc'),
    },
    {
      dataIndex: 'operator',
      render: (_, record) => {
        return (
          <Space>
            <Link
              onClick={(e) => e.stopPropagation()}
              to={`/progress/update/${record.workflow_template_name}`}
              component={Typography.Link}
            >
              {i18n.t('common.edit')}
            </Link>
            <Popconfirm
              title={i18n.t('workflowTemplate.delete.confirm', {
                name: record.workflow_template_name,
              })}
              onConfirm={deleteTemplate.bind(
                null,
                record.workflow_template_name ?? ''
              )}
            >
              <Typography.Link
                type="danger"
                onClick={(e) => e.stopPropagation()}
              >
                {i18n.t('common.delete')}
              </Typography.Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};
