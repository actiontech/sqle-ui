import { Layout } from 'antd';
import React from 'react';
import useStyles from '../../theme';
import Header from './Header';
import EmptyBox from '../EmptyBox';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';

import './index.less';

const Nav: React.FC<{ children: React.ReactNode }> = (props) => {
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const styles = useStyles();

  return (
    <Layout className="sqle-layout">
      <Layout>
        <Layout.Header className={`sqle-layout-header ${styles.headerBg}`}>
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
