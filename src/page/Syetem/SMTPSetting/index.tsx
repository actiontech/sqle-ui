import useRequest from '@ahooksjs/use-request';
import { useBoolean } from 'ahooks';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Space,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import { PageFormLayout, ResponseCode } from '../../../data/common';

type SMTPSettingFormFields = {
  host: string;
  port: number;
  username: string;
  password: string;
  passwordConfirm: string;
};

const SMTPSetting = () => {
  const { t } = useTranslation();
  const [form] = useForm<SMTPSettingFormFields>();
  const [
    modifyFlag,
    { setTrue: setModifyFlagTrue, setFalse: setModifyFlagFalse },
  ] = useBoolean(false);

  const { data: smtpInfo, refresh: refreshSMTPInfo } = useRequest(
    () => configuration.getSMTPConfigurationV1(),
    {
      formatResult(res) {
        return res.data.data ?? {};
      },
    }
  );

  const setFormDefaultValue = React.useCallback(() => {
    form.setFieldsValue({
      host: smtpInfo?.smtp_host,
      port: smtpInfo?.smtp_port
        ? Number.parseInt(smtpInfo.smtp_port, 10)
        : undefined,
      username: smtpInfo?.smtp_username,
    });
  }, [form, smtpInfo]);

  const handelClickModify = React.useCallback(() => {
    setModifyFlagTrue();
    setFormDefaultValue();
  }, [setFormDefaultValue, setModifyFlagTrue]);

  const handelClickCancel = React.useCallback(() => {
    setModifyFlagFalse();
    form.resetFields();
  }, [form, setModifyFlagFalse]);

  const [
    submitLoading,
    { setTrue: startSubmit, setFalse: submitFinish },
  ] = useBoolean();
  const submit = React.useCallback(
    (values: SMTPSettingFormFields) => {
      startSubmit();
      configuration
        .updateSMTPConfigurationV1({
          smtp_host: values.host,
          smtp_password: values.password,
          smtp_port: `${values.port}`,
          smtp_username: values.username,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            handelClickCancel();
            refreshSMTPInfo();
          }
        })
        .finally(() => {
          submitFinish();
        });
    },
    [handelClickCancel, refreshSMTPInfo, startSubmit, submitFinish]
  );

  return (
    <Card title={t('system.title.smtp')}>
      <section hidden={modifyFlag}>
        <Descriptions>
          <Descriptions.Item label={t('system.smtp.host')} span={3}>
            {smtpInfo?.smtp_host || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.smtp.port')} span={3}>
            {smtpInfo?.smtp_port || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('system.smtp.username')} span={3}>
            {smtpInfo?.smtp_username || '--'}
          </Descriptions.Item>
          <Descriptions.Item span={3}>
            <Button type="primary" onClick={handelClickModify}>
              {t('common.modify')}
            </Button>
          </Descriptions.Item>
        </Descriptions>
      </section>
      <Form
        {...PageFormLayout}
        hidden={!modifyFlag}
        form={form}
        onFinish={submit}
      >
        <Form.Item
          label={t('system.smtp.host')}
          name="host"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder={t('common.form.placeholder.input')} />
        </Form.Item>
        <Form.Item
          label={t('system.smtp.port')}
          name="port"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            max={65535}
            min={1}
            placeholder={t('common.form.placeholder.input')}
          />
        </Form.Item>
        <Form.Item
          label={t('system.smtp.username')}
          name="username"
          rules={[
            {
              required: true,
            },
            {
              type: 'email',
            },
          ]}
        >
          <Input placeholder={t('common.form.placeholder.input')} />
        </Form.Item>

        <Form.Item
          label={t('system.smtp.password')}
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password placeholder={t('common.form.placeholder.input')} />
        </Form.Item>
        <Form.Item
          label={t('system.smtp.passwordConfirm')}
          name="passwordConfirm"
          dependencies={['password']}
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t('common.form.rule.passwordNotMatch'))
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder={t('common.form.placeholder.input')} />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Space>
            <Button htmlType="submit" type="primary" loading={submitLoading}>
              {t('common.submit')}
            </Button>
            <Button onClick={handelClickCancel} disabled={submitLoading}>
              {t('common.cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SMTPSetting;
