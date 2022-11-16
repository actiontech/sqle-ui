import { DownOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, Popconfirm, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { IInstanceResV1 } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { timeAddZero } from '../../../utils/Common';

export const dataSourceColumns = (
  deleteDatabase: (instanceName: string) => void,
  testDatabaseConnection: (instanceName: string) => void,
  projectName: string
): TableColumn<IInstanceResV1, 'operate' | 'address' | 'connect'> => {
  return [
    {
      dataIndex: 'instance_name',
      title: () => i18n.t('dataSource.databaseList.instanceName'),
    },
    {
      dataIndex: 'address',
      title: () => i18n.t('dataSource.databaseList.address'),
      render(_, record) {
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
      dataIndex: 'rule_template_name',
      title: () => i18n.t('dataSource.databaseList.ruleTemplate'),
    },
    {
      dataIndex: 'maintenance_times',
      title: () => i18n.t('dataSource.databaseList.maintenanceTime'),
      render(value: IInstanceResV1['maintenance_times']) {
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
      render: (_, record) => {
        return (
          <>
            <Link
              to={`/project/${projectName}/data/update/${record.instance_name}`}
            >
              <Button type="link">{i18n.t('common.edit')}</Button>
            </Link>
            <Divider type="vertical" />
            <Popconfirm
              title={i18n.t('dataSource.deleteDatabase.confirmMessage', {
                name: record.instance_name,
              })}
              onConfirm={deleteDatabase.bind(null, record.instance_name ?? '')}
            >
              <Button type="link" danger>
                {i18n.t('common.delete')}
              </Button>
            </Popconfirm>
            <Divider type="vertical" />
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
              <Button type="link">
                {i18n.t('common.more')}
                <DownOutlined />
              </Button>
            </Dropdown>
          </>
        );
      },
    },
  ];
};
