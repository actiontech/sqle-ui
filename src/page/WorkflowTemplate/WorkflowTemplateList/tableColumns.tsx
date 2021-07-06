import { Popconfirm, Space, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { IWorkflowTemplateResV1 } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';

export const workflowTemplateListColumn = (
  deleteTemplate: (
    templateName: string,
    event?: React.MouseEvent<HTMLElement>
  ) => void
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
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Space>
              <Link to={`/progress/update/${record.workflow_template_name}`}>
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
                <Typography.Link type="danger">
                  {i18n.t('common.delete')}
                </Typography.Link>
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];
};
