import { TableColumn } from '../../../types/common.type';
import { t } from '../../../locale';
import { formatTime } from '../../../utils/Common';
import { IWorkflowDetailResV1 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import { Link } from '../../../components/Link';
import { renderOrderDesc } from '../../Order/List/column';

export const commonColumn: () => TableColumn<IWorkflowDetailResV1> = () => {
  const column: TableColumn<IWorkflowDetailResV1> = [
    {
      dataIndex: 'workflow_name',
      title: () => t('order.order.name'),
      render: (text, record) => {
        return (
          <EmptyBox if={!!text && !!record.project_name} defaultNode={text}>
            <Link
              to={`project/${record.project_name}/order/${record.workflow_id}`}
            >
              {text}
            </Link>
          </EmptyBox>
        );
      },
      width: 400,
    },
    {
      dataIndex: 'project_name',
      title: () => t('projectManage.projectForm.projectName'),
      width: 300,
      render: (projectName) => {
        return (
          <EmptyBox if={!!projectName} defaultNode={projectName}>
            <Link to={`project/${projectName}/overview`}>{projectName}</Link>
          </EmptyBox>
        );
      },
    },
    {
      dataIndex: 'desc',
      title: () => t('order.order.desc'),
      width: 600,
      render: (desc: string) => renderOrderDesc(desc, 600),
    },
    {
      dataIndex: 'create_time',
      title: () => t('order.order.createTime'),
      render: (time) => {
        return formatTime(time);
      },
      width: 'auto',
    },
  ];

  return column;
};
