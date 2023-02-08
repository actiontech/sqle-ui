import { TableColumn } from '../../../types/common.type';
import i18n from 'i18next';
import { formatTime } from '../../../utils/Common';
import { Link } from 'react-router-dom';
import { IWorkflowDetailResV1 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';

export const commonColumn: () => TableColumn<IWorkflowDetailResV1> = () => {
  return [
    {
      dataIndex: 'workflow_name',
      title: () => i18n.t('order.order.name'),
      render: (text, record) => {
        return (
          <EmptyBox if={text && record.project_name} defaultNode={text}>
            <Link
              to={`/project/${record.project_name}/order/${record.workflow_id}`}
            >
              {text}
            </Link>
          </EmptyBox>
        );
      },
      width: 'auto',
    },
    {
      dataIndex: 'project_name',
      title: () => i18n.t('projectManage.projectForm.projectName'),
      width: 'auto',
      render: (projectName) => {
        return (
          <EmptyBox if={projectName} defaultNode={projectName}>
            <Link to={`/project/${projectName}/overview`}>{projectName}</Link>
          </EmptyBox>
        );
      },
    },
    {
      dataIndex: 'desc',
      title: () => i18n.t('order.order.desc'),
      width: 'auto',
    },
    {
      dataIndex: 'create_time',
      title: () => i18n.t('order.order.createTime'),
      render: (time) => {
        return formatTime(time);
      },
      width: 'auto',
    },
  ];
};
