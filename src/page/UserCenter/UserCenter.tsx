import { Card, PageHeader, Tabs, TabsProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserCenterActiveTabKey } from '.';
import RoleList from './Role/RoleList';
import UserList from './User/UserList';
import UserGroupList from './UserGroup/UserGroupList';
import UserManageModal from './UserManageModal';
import { t } from '../../locale';

const tabItems: TabsProps['items'] = [
  {
    key: 'user',
    label: t('menu.user'),
    children: <UserList />,
  },
  {
    key: 'role',
    label: t('menu.role'),
    children: <RoleList />,
  },
  {
    key: 'userGroup',
    label: t('menu.userGroup'),
    children: <UserGroupList />,
  },
];

const UserCenter: React.FC = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<UserCenterActiveTabKey>('user');

  return (
    <article>
      <PageHeader title={t('user.pageTitle')} ghost={false}>
        {t('user.pageDesc')}
      </PageHeader>

      <section className="padding-content">
        <Card>
          <Tabs
            onChange={(active) =>
              setActiveKey(active as UserCenterActiveTabKey)
            }
            activeKey={activeKey}
            items={tabItems}
          />
        </Card>
      </section>

      <UserManageModal />
    </article>
  );
};

export default UserCenter;
