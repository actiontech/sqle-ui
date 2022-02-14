import { PageHeader } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { initUserManageModalStatus } from '../../../store/userManage';
import UserGroupModal from './Modal';
import UserGroupList from './UserGroupList';

const UserGroup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initUserManageModalStatus({
        modalStatus: {
          [ModalName.Add_User_Group]: false,
          [ModalName.Update_User_Group]: false,
        },
      })
    );
  }, [dispatch]);

  return (
    <article className="user-manage-page">
      <PageHeader title={t('userGroup.pageTitle')} ghost={false}>
        {t('userGroup.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <UserGroupList />
      </section>
      <UserGroupModal />
    </article>
  );
};

export default UserGroup;
