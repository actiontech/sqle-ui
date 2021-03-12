import React from 'react';
import LoginBackground from './LoginBackground';
import useStyles from '../../theme';

import './index.less';
import { Button, Form, Input, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/img/logo.png';
import { useHistory } from 'react-router';
import { updateUser } from '../../store/user';
import { useDispatch } from 'react-redux';
import LanguageSelect from '../../components/LanguageSelect';
import user from '../../api/user';

const Login = () => {
  const theme = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const login = React.useCallback(
    (formData) => {
      user
        .loginV1({
          username: formData.username,
          password: formData.password,
        })
        .then((res) => {
          dispatch(
            updateUser({
              username: 'Test',
              role: 'admin',
              token: res.data.data?.token ?? '',
            })
          );
          history.push('/');
        });
    },
    [dispatch, history]
  );

  React.useLayoutEffect(() => {
    new LoginBackground('#login-background');
  }, []);

  return (
    <section className="login-page">
      <canvas id="login-background"></canvas>
      <div className={`login-page-form-wrapper ${theme.loginBg}`}>
        <div className="login-page-powered">
          <img src={logo} alt="" />
          {t('login.powered')}
        </div>
        <Typography.Paragraph className="login-page-title">
          <Typography.Title level={4}>{t('login.pageTitle')}</Typography.Title>
        </Typography.Paragraph>
        <Form onFinish={login}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: t('common.form.rule.require', {
                  name: t('common.username'),
                }),
              },
            ]}
          >
            <Input placeholder={t('common.username')} autoFocus />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t('common.form.rule.require', {
                  name: t('common.password'),
                }),
              },
            ]}
          >
            <Input.Password placeholder={t('common.password')} />
          </Form.Item>
          <Button type="primary" block htmlType="submit">
            {t('login.login')}
          </Button>
        </Form>
      </div>
      <div className="login-page-language-wrapper">
        <LanguageSelect />
      </div>
    </section>
  );
};

export default Login;
