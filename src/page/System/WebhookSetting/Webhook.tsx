import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Switch,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import { PageFormLayout, ResponseCode } from '../../../data/common';

type WebhookFormFields = {
  enable: boolean;
  appId: string;
  appSecret: string;
  maxRetryTimes: number;
  retryIntervalSeconds: number;
  url: string;
};

const DEFAULT_CONSTANT = {
  maxRetryTimes: 3,
  retryIntervalSeconds: 1,
  appId: 'sqle',
};

const WebHook: React.FC = () => {
  const { t } = useTranslation();

  const [modifyFlag, { setTrue: startModify, setFalse: modifyFinish }] =
    useBoolean();
  const [enable, setEnable] = useState(false);

  const { data: webhookConfig, refresh } = useRequest(() =>
    configuration
      .getGlobalWorkflowWebHookConfig()
      .then((res) => res?.data?.data)
  );

  const [form] = useForm<WebhookFormFields>();

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const submit = (values: WebhookFormFields) => {
    startSubmit();
    configuration
      .updateGlobalWebHookConfig({
        enable: values.enable,
        app_id: values.appId,
        app_secret: values.appSecret,
        max_retry_times: values.maxRetryTimes ?? DEFAULT_CONSTANT.maxRetryTimes,
        retry_interval_seconds:
          values.retryIntervalSeconds ?? DEFAULT_CONSTANT.retryIntervalSeconds,
        url: values.url,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          refresh();
          form.resetFields();
          setEnable(false);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const handelClickModify = () => {
    setEnable(!!webhookConfig?.enable);
    form.setFieldsValue({
      enable: !!webhookConfig?.enable,
      appId: webhookConfig?.app_id || DEFAULT_CONSTANT.appId,
      maxRetryTimes:
        webhookConfig?.max_retry_times ?? DEFAULT_CONSTANT.maxRetryTimes,
      //retry_interval_seconds 后端默认返回 0, 而这个值的范围为 1-5
      retryIntervalSeconds:
        webhookConfig?.retry_interval_seconds ||
        DEFAULT_CONSTANT.retryIntervalSeconds,
      url: webhookConfig?.url,
    });
    startModify();
  };

  const testTing = useRef(false);
  const test = () => {
    if (testTing.current) {
      return;
    }

    testTing.current = true;
    const hide = message.loading(
      t('system.webhook.testing', { url: webhookConfig?.url ?? '' }),
      0
    );
    configuration
      .testGlobalWorkflowWebHookConfig()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (!res.data.data?.send_error_message) {
            message.success(t('system.webhook.testSuccess'));
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
    <Card title={t('system.title.webhook')}>
      <section hidden={modifyFlag}>
        <Descriptions>
          <Descriptions.Item
            label={t('system.webhook.enableWebhookNotify')}
            span={3}
          >
            {webhookConfig?.enable ? t('common.open') : t('common.close')}
          </Descriptions.Item>
          <Descriptions.Item label="Webhook url" span={3}>
            {webhookConfig?.url ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item span={3}>
            <Space>
              <Button onClick={test} type="primary" loading={submitLoading}>
                {t('system.webhook.test')}
              </Button>
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
          label={t('system.webhook.enableWebhookNotify')}
          name="enable"
          valuePropName="checked"
        >
          <Switch checked={enable} onChange={setEnable} />
        </Form.Item>
        <Form.Item
          label="Webhook url"
          name="url"
          rules={[
            {
              required: enable,
              type: 'url',
            },
          ]}
          tooltip={t('system.webhook.webhookUrlTips')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('system.webhook.maxRetryTimes')}
          name="maxRetryTimes"
          tooltip={t('system.webhook.maxRetryTimesTips')}
        >
          <InputNumber className="full-width-element" max={5} min={0} />
        </Form.Item>
        <Form.Item
          label={t('system.webhook.retryIntervalSeconds')}
          name="retryIntervalSeconds"
          tooltip={t('system.webhook.retryIntervalSecondsTips')}
        >
          <InputNumber className="full-width-element" min={1} max={5} />
        </Form.Item>
        <Form.Item
          label="App ID"
          name="appId"
          tooltip={t('system.webhook.appIdTips')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="App Secret"
          name="appSecret"
          tooltip={t('system.webhook.appSecretTips')}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Space>
            <Button htmlType="submit" type="primary" loading={submitLoading}>
              {t('common.submit')}
            </Button>
            <Button disabled={submitLoading} onClick={modifyFinish}>
              {t('common.cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default WebHook;
