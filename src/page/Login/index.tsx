import React, { useEffect } from 'react';

import './index.less';
import { Button, Checkbox, Form, Input, message, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/img/logo.png';
import { useHistory } from 'react-router';
import { updateToken } from '../../store/user';
import { useDispatch } from 'react-redux';
import user from '../../api/user';
import { ResponseCode } from '../../data/common';
import { useRequest } from 'ahooks';
import configuration from '../../api/configuration';
import EmptyBox from '../../components/EmptyBox';
import leftBg from '../../assets/img/login-left-bg.png';

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const login = (formData: {
    username: string;
    password: string;
    userAgreement: boolean;
  }) => {
    /* IFTRUE_isEE */
    if (!formData.userAgreement) {
      message.error(t('login.errorMessage.userAgreement'));
      return;
    }
    /* FITRUE_isEE */
    user
      .loginV1({
        username: formData.username,
        password: formData.password,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(updateToken({ token: res.data.data?.token ?? '' }));
          history.push('/');
        }
      });
  };

  const { run: getOauth2Tips, data: oauthConfig } = useRequest(
    () => configuration.getOauth2Tips(),
    {
      manual: true,
      formatResult(res) {
        return res.data?.data ?? {};
      },
    }
  );

  /* IFTRUE_isEE */
  useEffect(() => {
    getOauth2Tips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* FITRUE_isEE */
  return (
    <section className="login-page">
      <div className="login-page-powered">
        <img src={logo} alt="" />
        <div className="login-page-powered-split-line"></div>
        <div className="login-page-powered-title">{t('login.powered')}</div>
      </div>
      <div className="login-page-content">
        <div className="login-page-content-left-bg">
          <Typography.Paragraph className="login-page-title">
            <Typography.Title level={4}>
              <span className="login-page-title-content">
                {t('login.pageTitle')}
              </span>
            </Typography.Title>
          </Typography.Paragraph>
          <img src={leftBg} alt="" />
        </div>
        <div className="login-page-form-wrapper">
          <Form onFinish={login}>
            <Form.Item
              name="username"
              className="login-form-username"
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('common.username'),
                  }),
                },
              ]}
            >
              <Input
                className="login-page-input"
                placeholder={t('common.username')}
                autoFocus
              />
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
              className="login-form-password"
            >
              <Input.Password
                className="login-page-input"
                placeholder={t('common.password')}
              />
            </Form.Item>
            {/* IFTRUE_isEE */}
            <Form.Item
              name="userAgreement"
              className="user-agreement clear-margin"
              valuePropName="checked"
            >
              <Checkbox className="user-agreement-checkbox">
                {t('login.userAgreementTips')}
                <Typography.Link
                  underline={true}
                  href="/user-agreement.v4.2.html"
                  target="_blank"
                >
                  {t('login.userAgreement')}
                </Typography.Link>
              </Checkbox>
            </Form.Item>
            {/* FITRUE_isEE */}
            <Button type="primary" className="login-btn" htmlType="submit">
              {t('login.login')}
            </Button>
            <EmptyBox if={oauthConfig?.enable_oauth2}>
              <div
                className="other-login-method"
                style={{
                  paddingTop: 10,
                }}
              >
                {t('login.otherMethod')}:&nbsp;
                <Typography.Link href="/v1/oauth2/link">
                  {oauthConfig?.login_tip}
                </Typography.Link>
              </div>
            </EmptyBox>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
