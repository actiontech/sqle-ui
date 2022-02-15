import { PageHeader } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { initUserManageModalStatus } from '../../../store/userManage';
import RoleModal from './Modal';
import RoleList from './RoleList';

const RolePage = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const initModalStatus = () => {
    dispatch(
      initUserManageModalStatus({
        modalStatus: {
          [ModalName.Add_Role]: false,
          [ModalName.Update_Role]: false,
        },
      })
    );
  };

  useEffect(() => {
    initModalStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className="user-manage-page">
      <PageHeader title={t('role.pageTitle')} ghost={false}>
        {t('role.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <RoleList />
      </section>
      <RoleModal />
    </article>
  );
};

export default RolePage;
