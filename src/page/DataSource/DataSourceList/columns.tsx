import { DownOutlined } from '@ant-design/icons';
import {
  Divider,
  Dropdown,
  Menu,
  MenuProps,
  Popconfirm,
  Tag,
  Typography,
} from 'antd';
import { IInstanceResV2 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { timeAddZero } from '../../../utils/Common';
import { RuleUrlParamKey } from '../../Rule/useRuleFilterForm';
import { Link } from '../../../components/Link';

export const dataSourceColumns = (
  deleteDatabase: (instanceName: string) => void,
  testDatabaseConnection: (instanceName: string) => void,
  projectName: string,
  actionPermission: boolean,
  projectIsArchive: boolean
): TableColumn<IInstanceResV2, 'operate' | 'address' | 'connect'> => {
  return [
    {
      dataIndex: 'instance_name',
      title: () => t('dataSource.databaseList.instanceName'),
    },
    {
      dataIndex: 'address',
      title: () => t('dataSource.databaseList.address'),
      render(_, record) {
        if (!record.db_host || !record.db_port) {
          return '--';
        }
        return `${record.db_host}:${record.db_port}`;
      },
    },
    {
      dataIndex: 'source',
      title: () => t('dataSource.databaseList.source'),
    },
    {
      dataIndex: 'desc',
      title: () => t('dataSource.databaseList.describe'),
    },
    {
      dataIndex: 'db_type',
      title: () => t('dataSource.databaseList.type'),
    },
    {
      dataIndex: 'rule_template',
      title: () => t('dataSource.databaseList.ruleTemplate'),
      render(ruleTemplate: IInstanceResV2['rule_template']) {
        if (!ruleTemplate?.name) {
          return '';
        }

        const path = ruleTemplate.is_global_rule_template
          ? `rule?${RuleUrlParamKey.ruleTemplateName}=${ruleTemplate.name}`
          : `rule?${RuleUrlParamKey.projectName}=${projectName}&${RuleUrlParamKey.ruleTemplateName}=${ruleTemplate.name}`;

        return <Link to={path}>{ruleTemplate.name}</Link>;
      },
    },
    {
      dataIndex: 'maintenance_times',
      title: () => t('dataSource.databaseList.maintenanceTime'),
      render(value: IInstanceResV2['maintenance_times']) {
        return value?.map((t, i) => (
          <Tag key={i}>
            {timeAddZero(t.maintenance_start_time?.hour ?? 0)}:
            {timeAddZero(t.maintenance_start_time?.minute ?? 0)} -
            {timeAddZero(t.maintenance_stop_time?.hour ?? 0)}:
            {timeAddZero(t.maintenance_stop_time?.minute ?? 0)}
          </Tag>
        ));
      },
    },
    {
      dataIndex: 'operate',
      title: t('common.operate'),
      width: actionPermission && !projectIsArchive ? 180 : 80,
      render: (_, record) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'test-connection',
            onClick: () => testDatabaseConnection(record.instance_name ?? ''),
            label: t('dataSource.dataSourceForm.testDatabaseConnection'),
          },
        ];
        return (
          <>
            <EmptyBox if={actionPermission && !projectIsArchive}>
              <Link
                to={`project/${projectName}/data/update/${record.instance_name}`}
              >
                {t('common.edit')}
              </Link>
              <Divider type="vertical" />
              <Popconfirm
                title={t('dataSource.deleteDatabase.confirmMessage', {
                  name: record.instance_name,
                })}
                onConfirm={deleteDatabase.bind(
                  null,
                  record.instance_name ?? ''
                )}
              >
                <Typography.Link type="danger">
                  {t('common.delete')}
                </Typography.Link>
              </Popconfirm>
              <Divider type="vertical" />
            </EmptyBox>

            <Dropdown menu={{ items: menuItems }}>
              <Typography.Link>
                {t('common.more')}
                <DownOutlined />
              </Typography.Link>
            </Dropdown>
          </>
        );
      },
    },
  ];
};
