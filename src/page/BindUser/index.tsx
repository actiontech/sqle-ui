import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useStyles from '../../theme';
import LoginBackground from '../Login/LoginBackground';
import logo from '../../assets/img/logo.png';
import { Typography, Form, Input, Button, notification } from 'antd';
import LanguageSelect from '../../components/LanguageSelect';

import '../Login/index.less';
import oauth2 from '../../api/oauth2';
import { OauthLoginFormFields } from './index.type';
import { updateToken } from '../../store/user';
import { ResponseCode } from '../../data/common';

const BindUser = () => {
  const theme = useStyles();
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

  useLayoutEffect(() => {
    new LoginBackground('#login-background');
  }, []);

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
      <canvas id="login-background"></canvas>
      <div className={`login-page-form-wrapper ${theme.loginBg}`}>
        <div className="login-page-powered">
          <img src={logo} alt="" />
          {t('login.powered')}
        </div>
        <Typography.Paragraph className="login-page-title">
          <Typography.Title level={4}>
            {t('login.oauth.title')}
          </Typography.Title>
        </Typography.Paragraph>
        <Form onFinish={login}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: t('common.form.rule.require', {
                  name: t('login.oauth.form.username'),
                }),
              },
            ]}
          >
            <Input placeholder={t('login.oauth.form.username')} autoFocus />
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
          <Typography.Text className="font-size-small" type="secondary">
            {t('login.oauth.bindTips')}
          </Typography.Text>
          <Button type="primary" block htmlType="submit">
            {t('login.oauth.submitButton')}
          </Button>
        </Form>
      </div>
      <div className="login-page-language-wrapper">
        <LanguageSelect />
      </div>
    </section>
  );
};

export default BindUser;
