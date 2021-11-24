import useRequest from '@ahooksjs/use-request';
import {
  Button,
  Card,
  Col,
  Divider,
  PageHeader,
  Row,
  Tag,
  Typography,
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import user from '../../api/user';
import EmptyBox from '../../components/EmptyBox';
import { LoginTypeEnum } from '../../data/common';
import { ModalName } from '../../data/ModalName';
import ModifyPasswordModal from './Modal/ModifyPassword';
import UserEmail from './UserEmail';

const Account = () => {
  const { t } = useTranslation();
  const [modalStatus, setModalStatus] = useState({
    [ModalName.Modify_Password]: false,
  });

  const { data: userInfo, refresh } = useRequest(
    () => user.getCurrentUserV1(),
    {
      formatResult(res) {
        return res.data.data ?? {};
      },
    }
  );

  const handleChangeModalStatus = (modalName: ModalName, status: boolean) => {
    if (!Object.prototype.hasOwnProperty.call(modalStatus, modalName)) {
      return;
    }
    setModalStatus({
      ...modalStatus,
      [modalName]: status,
    });
  };

  const openModifyPasswordModal = () => {
    handleChangeModalStatus(ModalName.Modify_Password, true);
  };

  return (
    <>
      <PageHeader ghost={false} title={t('account.pageTitle')}>
        {t('account.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Card title={t('account.accountTitle')}>
          <Row>
            <Col sm={3} xs={24}>
              <Typography.Title level={5}>
                {t('user.userForm.username')}
              </Typography.Title>
            </Col>
            <Col sm={21} xs={24}>
              <Typography.Text>{userInfo?.user_name ?? '--'}</Typography.Text>
            </Col>
            <UserEmail userInfo={userInfo} refreshUserInfo={refresh} />
            <Divider />
            <Col sm={3} xs={24}>
              <Typography.Title level={5}>
                {t('user.userForm.role')}
              </Typography.Title>
            </Col>
            <Col sm={21} xs={24}>
              <Typography.Text>
                <EmptyBox if={!!userInfo?.role_name_list} defaultNode="--">
                  {userInfo?.role_name_list?.map((role) => (
                    <Tag key={role}>{role}</Tag>
                  ))}
                </EmptyBox>
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Button
                disabled={userInfo?.login_type === LoginTypeEnum.ldap}
                type="primary"
                onClick={openModifyPasswordModal}
                data-testid="accountModifyPasswordBtn"
              >
                {t('account.modifyPassword.button')}
              </Button>
            </Col>
          </Row>
        </Card>
      </section>
      <ModifyPasswordModal
        visible={modalStatus[ModalName.Modify_Password]}
        setModalStatus={handleChangeModalStatus}
      />
    </>
  );
};

export default Account;
