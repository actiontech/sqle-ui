import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import { Typography, Form, Input, Button, notification } from 'antd';

import '../Login/index.less';
import oauth2 from '../../api/oauth2';
import { OauthLoginFormFields } from './index.type';
import { updateToken } from '../../store/user';
import { ResponseCode } from '../../data/common';
import leftBg from '../../assets/img/login-left-bg.png';

const BindUser = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const loginLock = useRef(false);
  const login = (values: OauthLoginFormFields) => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauth2Token = urlParams.get('oauth2_token');
    if (loginLock.current) {
      return;
    }
    loginLock.current = true;
    if (!oauth2Token) {
      notification.error({
        message: t('login.oauth.errorTitle'),
        description: t('login.oauth.lostOauth2Token'),
        duration: 0,
      });
      loginLock.current = false;
      return;
    }
    oauth2
      .bindOauth2User({
        oauth2_token: oauth2Token,
        user_name: values.username,
        pwd: values.password,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(updateToken({ token: res.data.data?.token ?? '' }));
          history.push('/');
        }
      })
      .finally(() => {
        loginLock.current = false;
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const userExist = urlParams.get('user_exist') === 'true';
    const token = urlParams.get('sqle_token');
    if (error) {
      notification.error({
        message: t('login.oauth.errorTitle'),
        description: error,
        duration: 0,
      });
    } else if (userExist) {
      if (!token) {
        notification.error({
          message: t('login.oauth.errorTitle'),
          description: t('login.oauth.lostToken'),
          duration: 0,
        });
      } else {
        dispatch(updateToken({ token: token ?? '' }));
        history.push('/');
      }
    }
  }, [dispatch, history, t]);

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
                    name: t('login.oauth.form.username'),
                  }),
                },
              ]}
            >
              <Input
                className="login-page-input"
                placeholder={t('login.oauth.form.username')}
                autoFocus
              />
            </Form.Item>
            <Form.Item
              name="password"
              className="login-form-password"
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('common.password'),
                  }),
                },
              ]}
            >
              <Input.Password
                className="login-page-input"
                placeholder={t('common.password')}
              />
            </Form.Item>
            <Typography.Text className="font-size-small" type="secondary">
              {t('login.oauth.bindTips')}
            </Typography.Text>
            <Button
              type="primary"
              block
              htmlType="submit"
              className="login-btn"
            >
              {t('login.oauth.submitButton')}
            </Button>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default BindUser;
