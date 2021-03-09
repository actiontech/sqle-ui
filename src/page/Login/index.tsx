import React from 'react';
import LoginBackground from './LoginBackground';
import useStyles from '../../theme';

import './index.less';
import { Form, Input, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const Login = () => {
  React.useLayoutEffect(() => {
    new LoginBackground('#login-background');
  }, []);

  const theme = useStyles();
  const { t, i18n } = useTranslation();
  console.log(i18n.exists('login'));
  return (
    <section className="login-page">
      <canvas id="login-background"></canvas>
      <div className={`login-page-form-wrapper ${theme.borderRadius}`}>
        <Typography.Title level={4} className="login-page-title">
          {t('login.pageTitle')}
        </Typography.Title>
        <Form>
          <Form.Item>
            <Input placeholder={t('common.username')} />
          </Form.Item>
          <Form.Item>
            <Input placeholder={t('common.password')} />
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Login;
