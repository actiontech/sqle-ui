import { DownOutlined } from '@ant-design/icons';
import { Divider, Dropdown, Menu, Popconfirm, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IInstanceResV2 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { timeAddZero } from '../../../utils/Common';
import { RuleUrlParamKey } from '../../Rule/useRuleFilterForm';

export const dataSourceColumns = (
  deleteDatabase: (instanceName: string) => void,
  testDatabaseConnection: (instanceName: string) => void,
  projectName: string,
  actionPermission: boolean
): TableColumn<IInstanceResV2, 'operate' | 'address' | 'connect'> => {
  return [
    {
      dataIndex: 'instance_name',
      title: () => i18n.t('dataSource.databaseList.instanceName'),
    },
    {
      dataIndex: 'address',
      title: () => i18n.t('dataSource.databaseList.address'),
      render(_, record) {
        if (!record.db_host || !record.db_port) {
          return '--';
        }
        return `${record.db_host}:${record.db_port}`;
      },
    },
    {
      dataIndex: 'desc',
      title: () => i18n.t('dataSource.databaseList.describe'),
    },
    {
      dataIndex: 'db_type',
      title: () => i18n.t('dataSource.databaseList.type'),
    },
    {
      dataIndex: 'rule_template',
      title: () => i18n.t('dataSource.databaseList.ruleTemplate'),
      render(ruleTemplate: IInstanceResV2['rule_template']) {
        if (!ruleTemplate?.name) {
          return '';
        }

        const path = ruleTemplate.is_global_rule_template
          ? `/rule?${RuleUrlParamKey.ruleTemplateName}=${ruleTemplate.name}`
          : `/rule?${RuleUrlParamKey.projectName}=${projectName}&${RuleUrlParamKey.ruleTemplateName}=${ruleTemplate.name}`;

        return <Link to={path}>{ruleTemplate.name}</Link>;
      },
    },
    {
      dataIndex: 'maintenance_times',
      title: () => i18n.t('dataSource.databaseList.maintenanceTime'),
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
      title: i18n.t('common.operate'),
      width: actionPermission ? 180 : 40,
      render: (_, record) => {
        return (
          <>
            <EmptyBox if={actionPermission}>
              <Link
                to={`/project/${projectName}/data/update/${record.instance_name}`}
              >
                {i18n.t('common.edit')}
              </Link>
              <Divider type="vertical" />
              <Popconfirm
                title={i18n.t('dataSource.deleteDatabase.confirmMessage', {
                  name: record.instance_name,
                })}
                onConfirm={deleteDatabase.bind(
                  null,
                  record.instance_name ?? ''
                )}
              >
                <Typography.Link type="danger">
                  {i18n.t('common.delete')}
                </Typography.Link>
              </Popconfirm>
              <Divider type="vertical" />
            </EmptyBox>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="test-connection"
                    onClick={testDatabaseConnection.bind(
                      null,
                      record.instance_name ?? ''
                    )}
                  >
                    {i18n.t('dataSource.dataSourceForm.testDatabaseConnection')}
                  </Menu.Item>
                </Menu>
              }
            >
              <Typography.Link>
                {i18n.t('common.more')}
                <DownOutlined />
              </Typography.Link>
            </Dropdown>
          </>
        );
      },
    },
  ];
};
