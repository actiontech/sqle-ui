import useRequest from '@ahooksjs/use-request';
import { Card, Col, Divider, PageHeader, Row, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import user from '../../api/user';
import EmptyBox from '../../components/EmptyBox';
import { IReduxState } from '../../store';
import UserEmail from './UserEmail';

const Account = () => {
  const { t } = useTranslation();
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );

  const { data: userInfo, refresh } = useRequest(
    () => user.getUserV1({ user_name: username }),
    {
      formatResult(res) {
        return res.data.data ?? {};
      },
    }
  );
  const [a, seta] = useState(1);

  return (
    <>
      <PageHeader ghost={false} title={t('account.pageTitle')}>
        {t('account.pageDesc')}
        <button onClick={() => seta((c) => c + 1)}>a</button>
      </PageHeader>
      <section className="padding-content">
        <Card title={t('account.accountTitle')}>
          <Row>
            <Col sm={3} xs={24}>
              <Typography.Title level={5}>
                {t('common.username')}
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
          </Row>
        </Card>
      </section>
    </>
  );
};

export default Account;
