import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import { IUpdateOauth2ConfigurationV1Params } from '../../../api/configuration/index.d';
import EmptyBox from '../../../components/EmptyBox';
import IconTipsLabel from '../../../components/IconTipsLabel';
import { ResponseCode } from '../../../data/common';
import { OauthFormField } from './index.type';
import useConditionalConfig, {
  ReadOnlyConfigColumnsType,
  renderReadOnlyModeConfig,
} from '../hooks/useConditionalConfig';
import { IGetOauth2ConfigurationResDataV1 } from '../../../api/common';

const Oauth = () => {
  const { t } = useTranslation();

  const {
    form,
    renderEditingModeConfig,
    startModify,
    modifyFinish,
    modifyFlag,
  } = useConditionalConfig<OauthFormField>({
    switchFieldName: 'enable',
  });

  const {
    loading: getConfigLoading,
    data: oauthConfig,
    refresh: refreshOauthConfig,
  } = useRequest(() =>
    configuration.getOauth2ConfigurationV1().then((res) => res.data?.data ?? {})
  );

  const handleCancel = () => {
    form.resetFields();
    modifyFinish();
  };

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const handleSubmit = async (value: OauthFormField) => {
    startSubmit();
    const params: IUpdateOauth2ConfigurationV1Params = {
      enable_oauth2: value.enable,
      client_id: value.clientId,
      client_key: value.clientSecret,
      client_host: value.clientHost,
      server_auth_url: value.serverAuthUrl,
      server_token_url: value.serverTokenUrl,
      server_user_id_url: value.serverUserIdUrl,
      access_token_tag: value.accessTokenKeyName,
      login_tip: value.loginButtonText,
      user_id_tag: value.userIdKeyName,
    };
    if (!!value.scopes) {
      params.scopes = value.scopes.split(',');
    }
    try {
      const res = await configuration.updateOauth2ConfigurationV1(params);
      if (res.data.code === ResponseCode.SUCCESS) {
        refreshOauthConfig();
        handleCancel();
      }
    } finally {
      submitFinish();
    }
  };

  const setDefaultValue = () => {
    form.setFieldsValue({
      enable: oauthConfig?.enable_oauth2,
      clientId: oauthConfig?.client_id,
      clientHost: oauthConfig?.client_host,
      serverAuthUrl: oauthConfig?.server_auth_url,
      serverTokenUrl: oauthConfig?.server_token_url,
      serverUserIdUrl: oauthConfig?.server_user_id_url,
      scopes: oauthConfig?.scopes?.join(','),
      accessTokenKeyName: oauthConfig?.access_token_tag,
      loginButtonText: oauthConfig?.login_tip,
      userIdKeyName: oauthConfig?.user_id_tag,
    });
  };

  useEffect(() => {
    if (modifyFlag) {
      setDefaultValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifyFlag]);

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IGetOauth2ConfigurationResDataV1> =
    useMemo(() => {
      return [
        {
          label: t('system.oauth.enable'),
          span: 3,
          dataIndex: 'enable_oauth2',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
        },
        {
          label: (
            <IconTipsLabel tips={t('system.oauth.clientIdTips')}>
              {t('system.oauth.clientId')}
            </IconTipsLabel>
          ),
          span: 3,
          dataIndex: 'client_id',
          hidden: !oauthConfig?.enable_oauth2,
        },
        {
          label: t('system.oauth.clientHostTips'),
          span: 3,
          dataIndex: 'client_host',
          hidden: !oauthConfig?.enable_oauth2,
        },
        {
          label: t('system.oauth.serverAuthUrl'),
          span: 3,
          dataIndex: 'server_auth_url',
          hidden: !oauthConfig?.enable_oauth2,
        },
        {
          label: t('system.oauth.serverTokenUrl'),
          span: 3,
          dataIndex: 'server_token_url',
          hidden: !oauthConfig?.enable_oauth2,
        },
        {
          label: t('system.oauth.serverUserIdUrl'),
          span: 3,
          dataIndex: 'server_user_id_url',
          hidden: !oauthConfig?.enable_oauth2,
        },
        {
          label: t('system.oauth.scopes'),
          span: 3,
          dataIndex: 'scopes',
          hidden: !oauthConfig?.enable_oauth2,

          render: (val) => {
            const scopes = val as string[];
            return (
              <EmptyBox if={(scopes?.length ?? 0) > 0} defaultNode="--">
                {scopes?.map((e) => (
                  <Tag key={e}>{e}</Tag>
                ))}
              </EmptyBox>
            );
          },
        },
        {
          label: (
            <IconTipsLabel tips={t('system.oauth.accessTokenKeyNameTips')}>
              {t('system.oauth.accessTokenKeyName')}
            </IconTipsLabel>
          ),
          span: 3,
          dataIndex: 'access_token_tag',
          hidden: !oauthConfig?.enable_oauth2,
        },
        {
          label: (
            <IconTipsLabel tips={t('system.oauth.userIdKeyNameTips')}>
              {t('system.oauth.userIdKeyName')}
            </IconTipsLabel>
          ),
          span: 3,
          dataIndex: 'user_id_tag',
          hidden: !oauthConfig?.enable_oauth2,
        },
        {
          label: (
            <IconTipsLabel tips={t('system.oauth.loginButtonTextTips')}>
              {t('system.oauth.loginButtonText')}
            </IconTipsLabel>
          ),
          span: 3,
          dataIndex: 'login_tip',
          hidden: !oauthConfig?.enable_oauth2,
        },
      ];
    }, [oauthConfig?.enable_oauth2, t]);

  return (
    <Card title={t('system.title.oauth')} loading={getConfigLoading}>
      {/* IFTRUE_isCE */}
      {t('system.oauth.ceTips')}
      <Typography.Paragraph>
        <ul>
          <li>
            <a href="https://actiontech.github.io/sqle-docs-cn/">
              https://actiontech.github.io/sqle-docs-cn/
            </a>
          </li>
          <li>
            <a href="https://www.actionsky.com/">https://www.actionsky.com/</a>
          </li>
        </ul>
      </Typography.Paragraph>
      {/* FITRUE_isCE */}
      {/* IFTRUE_isEE */}
      <section hidden={modifyFlag}>
        {/* <Descriptions>
          <Descriptions.Item label={t('system.oauth.enable')} span={3}>
            {oauthConfig?.enable_oauth2 ? t('common.open') : t('common.close')}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <IconTipsLabel tips={t('system.oauth.clientIdTips')}>
                {t('system.oauth.clientId')}
              </IconTipsLabel>
            }
            span={3}
          >
            {oauthConfig?.client_id || '--'}
          </Descriptions.Item>

          <Descriptions.Item label={t('system.oauth.clientHostTips')} span={3}>
            {oauthConfig?.client_host || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.oauth.serverAuthUrl')} span={3}>
            {oauthConfig?.server_auth_url || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.oauth.serverTokenUrl')} span={3}>
            {oauthConfig?.server_token_url || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.oauth.serverUserIdUrl')} span={3}>
            {oauthConfig?.server_user_id_url || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.oauth.scopes')} span={3}>
            <EmptyBox
              if={(oauthConfig?.scopes?.length ?? 0) > 0}
              defaultNode="--"
            >
              {oauthConfig?.scopes?.map((e) => (
                <Tag key={e}>{e}</Tag>
              ))}
            </EmptyBox>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <IconTipsLabel tips={t('system.oauth.accessTokenKeyNameTips')}>
                {t('system.oauth.accessTokenKeyName')}
              </IconTipsLabel>
            }
            span={3}
          >
            {oauthConfig?.access_token_tag || '--'}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <IconTipsLabel tips={t('system.oauth.userIdKeyNameTips')}>
                {t('system.oauth.userIdKeyName')}
              </IconTipsLabel>
            }
            span={3}
          >
            {oauthConfig?.user_id_tag || '--'}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <IconTipsLabel tips={t('system.oauth.loginButtonTextTips')}>
                {t('system.oauth.loginButtonText')}
              </IconTipsLabel>
            }
            span={3}
          >
            {oauthConfig?.login_tip || '--'}
          </Descriptions.Item>

          <Descriptions.Item span={3}>
            <Button type="primary" onClick={startModify}>
              {t('common.modify')}
            </Button>
          </Descriptions.Item>
        </Descriptions> */}
        {renderReadOnlyModeConfig({
          data: oauthConfig ?? {},
          columns: readonlyColumnsConfig,
          extra: (
            <Button type="primary" onClick={startModify}>
              {t('common.modify')}
            </Button>
          ),
        })}
      </section>
      {renderEditingModeConfig({
        switchField: (
          <Form.Item
            name="enable"
            valuePropName="checked"
            label={t('system.oauth.enable')}
          >
            <Switch />
          </Form.Item>
        ),
        configField: (
          <>
            <Form.Item
              name="clientId"
              label={
                <IconTipsLabel tips={t('system.oauth.clientIdTips')}>
                  {t('system.oauth.clientId')}
                </IconTipsLabel>
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('system.oauth.clientId'),
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="clientSecret"
              label={
                <IconTipsLabel tips={t('system.oauth.clientSecretTips')}>
                  {t('system.oauth.clientSecret')}
                </IconTipsLabel>
              }
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="clientHost"
              label={
                <IconTipsLabel tips={t('system.oauth.clientHostTips')}>
                  {t('system.oauth.clientHost')}
                </IconTipsLabel>
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('system.oauth.clientHost'),
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="serverAuthUrl"
              label={
                <IconTipsLabel tips={t('system.oauth.serverAuthUrlTips')}>
                  {t('system.oauth.serverAuthUrl')}
                </IconTipsLabel>
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('system.oauth.serverAuthUrl'),
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="serverTokenUrl"
              label={
                <IconTipsLabel tips={t('system.oauth.serverTokenUrlTips')}>
                  {t('system.oauth.serverTokenUrl')}
                </IconTipsLabel>
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('system.oauth.serverTokenUrl'),
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="serverUserIdUrl"
              label={
                <IconTipsLabel tips={t('system.oauth.serverUserIdUrlTips')}>
                  {t('system.oauth.serverUserIdUrl')}
                </IconTipsLabel>
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('system.oauth.serverUserIdUrl'),
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="scopes"
              label={
                <IconTipsLabel tips={t('system.oauth.scopesTips')}>
                  {t('system.oauth.scopes')}
                </IconTipsLabel>
              }
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="accessTokenKeyName"
              label={
                <IconTipsLabel tips={t('system.oauth.accessTokenKeyNameTips')}>
                  {t('system.oauth.accessTokenKeyName')}
                </IconTipsLabel>
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('system.oauth.accessTokenKeyName'),
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="userIdKeyName"
              label={
                <IconTipsLabel tips={t('system.oauth.userIdKeyNameTips')}>
                  {t('system.oauth.userIdKeyName')}
                </IconTipsLabel>
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('system.oauth.userIdKeyName'),
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="loginButtonText"
              label={
                <IconTipsLabel tips={t('system.oauth.loginButtonTextTips')}>
                  {t('system.oauth.loginButtonText')}
                </IconTipsLabel>
              }
            >
              <Input />
            </Form.Item>
          </>
        ),
        submitButtonField: (
          <Space>
            <Button loading={submitLoading} htmlType="submit" type="primary">
              {t('common.submit')}
            </Button>
            <Button disabled={submitLoading} onClick={handleCancel}>
              {t('common.cancel')}
            </Button>
          </Space>
        ),
        submit: handleSubmit,
      })}
      {/* <Form
        {...PageFormLayout}
        form={form}
        hidden={!modifyFlag}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="enable"
          valuePropName="checked"
          label={t('system.oauth.enable')}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="clientId"
          label={
            <IconTipsLabel tips={t('system.oauth.clientIdTips')}>
              {t('system.oauth.clientId')}
            </IconTipsLabel>
          }
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('system.oauth.clientId'),
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="clientSecret"
          label={
            <IconTipsLabel tips={t('system.oauth.clientSecretTips')}>
              {t('system.oauth.clientSecret')}
            </IconTipsLabel>
          }
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="clientHost"
          label={
            <IconTipsLabel tips={t('system.oauth.clientHostTips')}>
              {t('system.oauth.clientHost')}
            </IconTipsLabel>
          }
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('system.oauth.clientHost'),
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="serverAuthUrl"
          label={
            <IconTipsLabel tips={t('system.oauth.serverAuthUrlTips')}>
              {t('system.oauth.serverAuthUrl')}
            </IconTipsLabel>
          }
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('system.oauth.serverAuthUrl'),
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="serverTokenUrl"
          label={
            <IconTipsLabel tips={t('system.oauth.serverTokenUrlTips')}>
              {t('system.oauth.serverTokenUrl')}
            </IconTipsLabel>
          }
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('system.oauth.serverTokenUrl'),
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="serverUserIdUrl"
          label={
            <IconTipsLabel tips={t('system.oauth.serverUserIdUrlTips')}>
              {t('system.oauth.serverUserIdUrl')}
            </IconTipsLabel>
          }
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('system.oauth.serverUserIdUrl'),
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="scopes"
          label={
            <IconTipsLabel tips={t('system.oauth.scopesTips')}>
              {t('system.oauth.scopes')}
            </IconTipsLabel>
          }
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="accessTokenKeyName"
          label={
            <IconTipsLabel tips={t('system.oauth.accessTokenKeyNameTips')}>
              {t('system.oauth.accessTokenKeyName')}
            </IconTipsLabel>
          }
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('system.oauth.accessTokenKeyName'),
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="userIdKeyName"
          label={
            <IconTipsLabel tips={t('system.oauth.userIdKeyNameTips')}>
              {t('system.oauth.userIdKeyName')}
            </IconTipsLabel>
          }
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('system.oauth.userIdKeyName'),
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="loginButtonText"
          label={
            <IconTipsLabel tips={t('system.oauth.loginButtonTextTips')}>
              {t('system.oauth.loginButtonText')}
            </IconTipsLabel>
          }
        >
          <Input />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Space>
            <Button loading={submitLoading} htmlType="submit" type="primary">
              {t('common.submit')}
            </Button>
            <Button disabled={submitLoading} onClick={handleCancel}>
              {t('common.cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form> */}
      {/* FITRUE_isEE */}
    </Card>
  );
};

export default Oauth;
