import { InfoCircleOutlined } from '@ant-design/icons';
import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, Form, Input, Space, Switch, Tooltip } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import { ResponseCode } from '../../../data/common';
import { validatorPort } from '../../../utils/FormRule';
import { LDAPFormFields } from './index.type';
import useConditionalConfig, {
  ReadOnlyConfigColumnsType,
  renderReadOnlyModeConfig,
} from '../hooks/useConditionalConfig';
import { ILDAPConfigurationResV1 } from '../../../api/common';

const LDAPSetting = () => {
  const { t } = useTranslation();

  const {
    form,
    renderEditingModeConfig,
    startModify,
    modifyFinish,
    modifyFlag,
  } = useConditionalConfig<LDAPFormFields>({
    switchFieldName: 'enable_ldap',
  });
  const {
    data: ldapSetting,
    loading,
    run: getLDAPSetting,
  } = useRequest(
    () => configuration.getLDAPConfigurationV1().then((res) => res.data.data),
    {
      manual: true,
    }
  );

  useEffect(() => {
    getLDAPSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!ldapSetting && modifyFlag) {
      form.setFieldsValue({
        enable_ldap: ldapSetting.enable_ldap,
        enable_ssl: ldapSetting.enable_ssl,
        ldap_server_host: ldapSetting.ldap_server_host,
        ldap_server_port: ldapSetting.ldap_server_port,
        ldap_connect_dn: ldapSetting.ldap_connect_dn,
        ldap_search_base_dn: ldapSetting.ldap_search_base_dn,
        ldap_user_name_rdn_key: ldapSetting.ldap_user_name_rdn_key,
        ldap_user_email_rdn_key: ldapSetting.ldap_user_email_rdn_key,
      });
    }
  }, [form, ldapSetting, modifyFlag]);
  const [
    submitLoading,
    { setTrue: startUpdateLdap, setFalse: updateLdapFinish },
  ] = useBoolean();
  const handleSubmit = (values: LDAPFormFields) => {
    startUpdateLdap();
    configuration
      .updateLDAPConfigurationV1({
        ...values,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          getLDAPSetting();
        }
      })
      .finally(() => {
        updateLdapFinish();
      });
  };

  const cancel = () => {
    modifyFinish();
    form.resetFields();
  };

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<ILDAPConfigurationResV1> =
    useMemo(() => {
      return [
        {
          label: t('system.ldap.enableLdap'),
          span: 3,
          dataIndex: 'enable_ldap',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
        },
        {
          label: t('system.ldap.enableLdapSSL'),
          span: 3,
          dataIndex: 'enable_ssl',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
          hidden: !ldapSetting?.enable_ldap,
        },
        {
          label: t('system.ldap.ldapServerHost'),
          span: 3,
          dataIndex: 'ldap_server_host',
          hidden: !ldapSetting?.enable_ldap,
        },
        {
          label: t('system.ldap.ldapServerPort'),
          span: 3,
          dataIndex: 'ldap_server_port',
          hidden: !ldapSetting?.enable_ldap,
        },
        {
          label: t('system.ldap.ldapConnectDn'),
          span: 3,
          dataIndex: 'ldap_connect_dn',
          hidden: !ldapSetting?.enable_ldap,
        },
        {
          label: t('system.ldap.ldapSearchBaseDn'),
          span: 3,
          dataIndex: 'ldap_search_base_dn',
          hidden: !ldapSetting?.enable_ldap,
        },
        {
          label: t('system.ldap.ldapSearchBaseDn'),
          span: 3,
          dataIndex: 'ldap_search_base_dn',
          hidden: !ldapSetting?.enable_ldap,
        },
        {
          label: t('system.ldap.ldapUserNameRdnKey'),
          span: 3,
          dataIndex: 'ldap_user_name_rdn_key',
          hidden: !ldapSetting?.enable_ldap,
        },
        {
          label: t('system.ldap.ldapUserEmailRdnKey'),
          span: 3,
          dataIndex: 'ldap_user_email_rdn_key',
          hidden: !ldapSetting?.enable_ldap,
        },
      ];
    }, [ldapSetting?.enable_ldap, t]);

  return (
    <Card title={t('system.title.ldap')} loading={loading}>
      <section hidden={modifyFlag}>
        {/* <Descriptions>
          <Descriptions.Item label={t('system.ldap.enableLdap')} span={3}>
            {ldapSetting?.enable_ldap ? t('common.open') : t('common.close')}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.ldap.enableLdapSSL')} span={3}>
            {ldapSetting?.enable_ssl ? t('common.open') : t('common.close')}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.ldap.ldapServerHost')} span={3}>
            {ldapSetting?.ldap_server_host ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.ldap.ldapServerPort')} span={3}>
            {ldapSetting?.ldap_server_port ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.ldap.ldapConnectDn')} span={3}>
            {ldapSetting?.ldap_connect_dn ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.ldap.ldapSearchBaseDn')} span={3}>
            {ldapSetting?.ldap_search_base_dn ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item
            label={t('system.ldap.ldapUserNameRdnKey')}
            span={3}
          >
            {ldapSetting?.ldap_user_name_rdn_key ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item
            label={t('system.ldap.ldapUserEmailRdnKey')}
            span={3}
          >
            {ldapSetting?.ldap_user_email_rdn_key ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item span={3}>
            <Button type="primary" onClick={startModify}>
              {t('common.modify')}
            </Button>
          </Descriptions.Item>
        </Descriptions> */}
        {renderReadOnlyModeConfig({
          data: ldapSetting ?? {},
          columns: readonlyColumnsConfig,
          extra: (
            <Button type="primary" onClick={startModify}>
              {t('common.modify')}
            </Button>
          ),
        })}
      </section>
      {/* <Form
        {...PageFormLayout}
        form={form}
        hidden={!modifyFlag}
        onFinish={handleSubmit}
      ></Form> */}
      {renderEditingModeConfig({
        switchField: (
          <Form.Item
            label={t('system.ldap.enableLdap')}
            name="enable_ldap"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        ),
        configField: (
          <>
            <Form.Item
              label={t('system.ldap.enableLdapSSL')}
              name="enable_ssl"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={t('system.ldap.ldapServerHost')}
              name="ldap_server_host"
            >
              <Input placeholder={t('common.form.placeholder.input')} />
            </Form.Item>
            <Form.Item
              label={t('system.ldap.ldapServerPort')}
              name="ldap_server_port"
              rules={[
                {
                  validator: validatorPort(),
                },
              ]}
            >
              <Input placeholder={t('common.form.placeholder.input')} />
            </Form.Item>
            <Form.Item
              label={
                <>
                  <Space>
                    <Tooltip overlay={t('system.ldap.ldapConnectDnTips')}>
                      <InfoCircleOutlined className="text-orange" />
                    </Tooltip>
                    {t('system.ldap.ldapConnectDn')}
                  </Space>
                </>
              }
              name="ldap_connect_dn"
            >
              <Input placeholder={t('common.form.placeholder.input')} />
            </Form.Item>
            <Form.Item
              label={t('system.ldap.ldapConnectPwd')}
              name="ldap_connect_pwd"
            >
              <Input.Password
                placeholder={t('common.form.placeholder.input')}
              />
            </Form.Item>
            <Form.Item
              label={
                <>
                  <Space>
                    <Tooltip overlay={t('system.ldap.ldapSearchBaseDnTips')}>
                      <InfoCircleOutlined className="text-orange" />
                    </Tooltip>
                    {t('system.ldap.ldapSearchBaseDn')}
                  </Space>
                </>
              }
              name="ldap_search_base_dn"
            >
              <Input placeholder={t('common.form.placeholder.input')} />
            </Form.Item>
            <Form.Item
              label={
                <>
                  <Space>
                    <Tooltip overlay={t('system.ldap.ldapUserNameRdnKeyTips')}>
                      <InfoCircleOutlined className="text-orange" />
                    </Tooltip>
                    {t('system.ldap.ldapUserNameRdnKey')}
                  </Space>
                </>
              }
              name="ldap_user_name_rdn_key"
            >
              <Input placeholder={t('common.form.placeholder.input')} />
            </Form.Item>
            <Form.Item
              label={
                <>
                  <Space>
                    <Tooltip overlay={t('system.ldap.ldapUserEmailRdnKeyTips')}>
                      <InfoCircleOutlined className="text-orange" />
                    </Tooltip>
                    {t('system.ldap.ldapUserEmailRdnKey')}
                  </Space>
                </>
              }
              name="ldap_user_email_rdn_key"
            >
              <Input placeholder={t('common.form.placeholder.input')} />
            </Form.Item>
          </>
        ),
        submitButtonField: (
          <Form.Item label=" " colon={false}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                {t('common.submit')}
              </Button>
              <Button onClick={cancel} disabled={submitLoading}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        ),
        submit: handleSubmit,
      })}
    </Card>
  );
};

export default LDAPSetting;
