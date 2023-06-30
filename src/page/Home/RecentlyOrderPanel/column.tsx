import { IWorkflowDetailResV1 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import { Link } from '../../../components/Link';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';
import { renderOrderDesc } from '../../Order/List/column';

export const customColumn: () => TableColumn<IWorkflowDetailResV1> = () => {
  const columns: TableColumn<IWorkflowDetailResV1> = [
    {
      dataIndex: 'workflow_name',
      title: () => t('order.order.name'),
      render: (text, record) => {
        return (
          <EmptyBox if={text && record.project_name} defaultNode={text}>
            <Link
              to={`project/${record.project_name}/order/${record.workflow_id}`}
            >
              {text}
            </Link>
          </EmptyBox>
        );
      },
    },
    {
      dataIndex: 'project_name',
      title: () => t('projectManage.projectForm.projectName'),
      render: (projectName) => {
        return (
          <EmptyBox if={projectName} defaultNode={projectName}>
            <Link to={`project/${projectName}/overview`}>{projectName}</Link>
          </EmptyBox>
        );
      },
    },
    {
      dataIndex: 'desc',
      title: () => t('order.order.desc'),
      width: '30%',
      render: (desc: string) => renderOrderDesc(desc, 600),
    },
    {
      dataIndex: 'create_time',
      title: () => t('order.order.createTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'status',
      title: () => t('order.order.status'),
      render: (status) => {
        return <OrderStatusTag status={status} />;
      },
    },
  ];

  return columns;
};
