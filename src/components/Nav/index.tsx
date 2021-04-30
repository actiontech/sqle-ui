import { Layout } from 'antd';
import React from 'react';
import SiderMenu from './SiderMenu';
import logo from '../../assets/img/logo.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStyles from '../../theme';
import Header from './Header';
import EmptyBox from '../EmptyBox';

import './index.less';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';

const Nav: React.FC = (props) => {
  const { t } = useTranslation();
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const styles = useStyles();

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
        <EmptyBox if={!!username}>
          <Layout.Content>{props.children}</Layout.Content>
        </EmptyBox>
      </Layout>
    </Layout>
  );
};

export default Nav;
