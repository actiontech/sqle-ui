import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Popover,
  Row,
  Space,
  Switch,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import { PageFormLayout, ResponseCode } from '../../../data/common';

type SMTPSettingFormFields = {
  enable: boolean;
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

  const { data: smtpInfo, refresh: refreshSMTPInfo } = useRequest(() =>
    configuration.getSMTPConfigurationV1().then((res) => res.data.data ?? {})
  );

  const setFormDefaultValue = React.useCallback(() => {
    form.setFieldsValue({
      enable: smtpInfo?.enable_smtp_notify ?? false,
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

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const submit = React.useCallback(
    (values: SMTPSettingFormFields) => {
      startSubmit();
      configuration
        .updateSMTPConfigurationV1({
          enable_smtp_notify: values.enable,
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

  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const [testForm] = useForm<{ receiveEmail?: string }>();
  const testTing = useRef(false);
  const test = async () => {
    if (testTing.current) {
      return;
    }
    const values = await testForm.validateFields();
    testTing.current = true;
    toggleTestPopoverVisible(false);
    const hide = message.loading(
      t('system.smtp.testing', {
        email: values.receiveEmail,
      }),
      0
    );
    configuration
      .testSMTPConfigurationV1({
        recipient_addr: values.receiveEmail,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (res.data.data?.is_smtp_send_normal) {
            message.success(
              t('system.smtp.testSuccess', { email: values.receiveEmail })
            );
            testForm.resetFields();
          } else {
            message.error(
              res.data.data?.send_error_message ?? t('common.unknownError')
            );
          }
        }
      })
      .finally(() => {
        hide();
        testTing.current = false;
      });
  };

  return (
    <Card title={t('system.title.smtp')}>
      <section hidden={modifyFlag}>
        <Descriptions>
          <Descriptions.Item label={t('system.smtp.enable')} span={3}>
            {smtpInfo?.enable_smtp_notify
              ? t('common.open')
              : t('common.close')}
          </Descriptions.Item>
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
            <Space>
              <Popover
                trigger="click"
                open={testPopoverVisible}
                onOpenChange={(visible) => {
                  if (!visible) {
                    testForm.resetFields();
                  }
                  toggleTestPopoverVisible(visible);
                }}
                content={
                  <Space direction="vertical" className="full-width-element">
                    <Form form={testForm}>
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name="receiveEmail"
                        label={t('system.smtp.receiver')}
                        rules={[
                          {
                            required: true,
                          },
                          {
                            type: 'email',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Form>
                    <Row>
                      <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" size="small" onClick={test}>
                          {t('common.ok')}
                        </Button>
                      </Col>
                    </Row>
                  </Space>
                }
              >
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={submitLoading}
                >
                  {t('system.smtp.test')}
                </Button>
              </Popover>
              <Button type="primary" onClick={handelClickModify}>
                {t('common.modify')}
              </Button>
            </Space>
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
          label={t('system.smtp.enable')}
          name="enable"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
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
