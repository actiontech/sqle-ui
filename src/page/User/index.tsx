import { PageHeader, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import UserManageModal from './Modal';
import RoleList from './RoleList';
import UserList from './UserList';

import './index.less';
import { useDispatch } from 'react-redux';
import { initUserManageModalStatus } from '../../store/userManage';
import { ModalName } from '../../data/ModalName';
import React from 'react';

const User = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(
      initUserManageModalStatus({
        modalStatus: {
          [ModalName.Add_Role]: false,
          [ModalName.Add_User]: false,
          [ModalName.Update_Role]: false,
          [ModalName.Update_User]: false,
          [ModalName.Update_User_Password]: false,
        },
      })
    );
  }, [dispatch]);

  return (
    <article className="user-manage-page">
      <PageHeader title={t('user.pageTitle')} ghost={false}>
        {t('user.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Space direction="vertical" className="full-width-element">
          <UserList />
          <RoleList />
        </Space>
      </section>
      <UserManageModal />
    </article>
  );
};

export default User;
