import { DownOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { IInstanceResV1 } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';

export const dataSourceColumns = (
  deleteDatabase: (instanceName: string) => void,
  testDatabaseConnection: (instanceName: string) => void
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
      dataIndex: 'role_name_list',
      title: () => i18n.t('dataSource.databaseList.role'),
      render(value: IInstanceResV1['role_name_list']) {
        return value?.join(',');
      },
    },
    {
      dataIndex: 'rule_template_name_list',
      title: () => i18n.t('dataSource.databaseList.ruleTemplate'),
      render(value: IInstanceResV1['rule_template_name_list']) {
        return value?.join(',');
      },
    },
    // {
    //   dataIndex: 'workflow_template_name',
    //   title: () => i18n.t('dataSource.databaseList.workflow'),
    // },

    {
      dataIndex: 'operate',
      render: (_, record) => {
        return (
          <>
            <Link to={`/data/update/${record.instance_name}`}>
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
