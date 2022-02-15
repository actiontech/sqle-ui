import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import UserModal from './Modal';
import { useDispatch } from 'react-redux';
import { initUserManageModalStatus } from '../../../store/userManage';
import { ModalName } from '../../../data/ModalName';
import React from 'react';
import UserList from './UserList';

const User = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(
      initUserManageModalStatus({
        modalStatus: {
          [ModalName.Add_User]: false,
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
        <UserList />
      </section>
      <UserModal />
    </article>
  );
};

export default User;
