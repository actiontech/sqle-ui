import { Card, PageHeader, Tabs } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserCenterActiveTabKey } from '.';
import RoleList from './Role/RoleList';
import UserList from './User/UserList';
import UserGroupList from './UserGroup/UserGroupList';
import UserManageModal from './UserManageModal';

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
          >
            <Tabs.TabPane key="user" tab={t('menu.user')}>
              <UserList />
            </Tabs.TabPane>
            <Tabs.TabPane key="role" tab={t('menu.role')}>
              <RoleList />
            </Tabs.TabPane>
            <Tabs.TabPane key="userGroup" tab={t('menu.userGroup')}>
              <UserGroupList />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </section>

      <UserManageModal />
    </article>
  );
};

export default UserCenter;
