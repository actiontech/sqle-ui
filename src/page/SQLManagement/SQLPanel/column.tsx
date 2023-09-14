import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';
import RenderExecuteSql from '../../Order/AuditResult/RenderExecuteSql';

export const SQLPanelColumns: () => TableColumn<any> = () => {
  return [
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.SQLFingerprint'),
      render: (sql: string) => <RenderExecuteSql sql={sql} />,
    },
    {
      dataIndex: '',
      title: () => 'SQL',
      render: (sql: string) => <RenderExecuteSql sql={sql} />,
    },
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.source'),
    },
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.instanceName'),
    },
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.auditResult'),
    },
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.firstOccurrence'),
      render: (time: string) => {
        return formatTime(time, '--');
      },
    },
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.lastOccurrence'),
      render: (time: string) => {
        return formatTime(time, '--');
      },
    },
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.occurrenceCount'),
    },
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.personInCharge'),
    },
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.status'),
    },
    {
      dataIndex: '',
      title: () => t('sqlManagement.table.comment'),
    },
  ];
};
