import { Layout } from 'antd';
import React from 'react';
import SiderMenu from './SiderMenu';
import logo from '../../assets/img/logo.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStyles from '../../theme';
import Header from './Header';
import { useRequest } from 'ahooks';
import { ResponseCode, SystemRole } from '../../data/common';
import { updateUser, updateToken } from '../../store/user';
import user from '../../api/user';
import EmptyBox from '../EmptyBox';
import { useDispatch } from 'react-redux';

import './index.less';

const Nav: React.FC = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const dispatch = useDispatch();

  const clearUserInfo = () => {
    dispatch(
      updateUser({
        username: '',
        role: '',
      })
    );
    dispatch(
      updateToken({
        token: '',
      })
    );
  };

  const { loading } = useRequest(user.getCurrentUserV1.bind(user), {
    onSuccess: (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        const data = res.data.data;
        dispatch(
          updateUser({
            username: data?.user_name ?? '',
            role: data?.is_admin ? SystemRole.admin : '',
          })
        );
      } else {
        clearUserInfo();
      }
    },
    onError: () => {
      clearUserInfo();
    },
  });

  return (
    <Layout className="sqle-layout">
      <Layout.Sider>
        <Link to="/">
          <div className="sqle-nav-title">
            <img src={logo} alt="" />
            {t('common.nav.title')}
          </div>
        </Link>
        <SiderMenu />
      </Layout.Sider>
      <Layout>
        <Layout.Header className={`sqle-header ${styles.headerBg}`}>
          <Header />
        </Layout.Header>
        <EmptyBox if={!loading}>
          <Layout.Content>{props.children}</Layout.Content>
        </EmptyBox>
      </Layout>
    </Layout>
  );
};

export default Nav;
