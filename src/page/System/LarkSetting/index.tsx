import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  message,
  Space,
  Switch,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import { PageFormLayout, ResponseCode } from '../../../data/common';

type FormFields = {
  enabled: boolean;
  appKey: string;
  appSecret: string;
};

const LarkSetting: React.FC = () => {
  const { t } = useTranslation();
  const [testButtonEnableStatus, { setFalse: finishTest, setTrue: startTest }] =
    useBoolean(false);
  const [form] = useForm<FormFields>();
  const [
    modifyFlag,
    { setTrue: setModifyFlagTrue, setFalse: setModifyFlagFalse },
  ] = useBoolean(false);
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [enable, setEnable] = useState(false);

  const handelClickModify = () => {
    setModifyFlagTrue();
    form.setFieldsValue({
      enabled: !!larkInfo?.is_feishu_notification_enabled,
      appKey: larkInfo?.app_id,
    });
  };

  const submitLarkConfig = (values: FormFields) => {
    startSubmit();
    configuration
      .updateFeishuConfigurationV1({
        is_feishu_notification_enabled: values.enabled,
        app_id: values.appKey,
        app_secret: values.appSecret,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          handelClickCancel();
          refreshLarkInfo();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const testLarkConfiguration = () => {
    startTest();
    const hide = message.loading(t('system.lark.testing'), 0);
    configuration
      .testFeishuConfigV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (res.data.data?.is_message_sent_normally) {
            message.success(t('system.lark.testSuccess'));
          } else {
            message.error(
              res.data.data?.error_message ?? t('common.unknownError')
            );
          }
        }
      })
      .finally(() => {
        hide();
        finishTest();
      });
  };

  const handelClickCancel = () => {
    form.resetFields();
    setModifyFlagFalse();
  };

  const { data: larkInfo, refresh: refreshLarkInfo } = useRequest(
    () => configuration.getFeishuConfigurationV1(),
    {
      formatResult(res) {
        return res.data.data ?? {};
      },
    }
  );

  return (
    <Card title={<>{t('system.title.lark')}</>}>
      <section hidden={modifyFlag}>
        <Descriptions>
          <Descriptions.Item label={t('system.lark.enable')} span={3}>
            {larkInfo?.is_feishu_notification_enabled
              ? t('common.open')
              : t('common.close')}
          </Descriptions.Item>
          <Descriptions.Item label="AppKey" span={3}>
            <Typography.Paragraph>
              {larkInfo?.app_id || '--'}
            </Typography.Paragraph>
          </Descriptions.Item>
          <Descriptions.Item span={3}>
            <Space>
              <Button
                type="primary"
                loading={submitLoading}
                onClick={testLarkConfiguration}
                disabled={testButtonEnableStatus}
              >
                {t('system.lark.test')}
              </Button>
              <Button
                type="primary"
                onClick={handelClickModify}
                disabled={testButtonEnableStatus}
              >
                {t('common.modify')}
              </Button>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </section>
      <Form
        form={form}
        hidden={!modifyFlag}
        onFinish={submitLarkConfig}
        {...PageFormLayout}
      >
        <Form.Item
          label={t('system.lark.enable')}
          name="enabled"
          valuePropName="checked"
        >
          <Switch checked={enable} onChange={setEnable} />
        </Form.Item>
        <Form.Item label="AppKey" name="appKey" rules={[{ required: true }]}>
          <Input
            disabled={!enable}
            placeholder={t('common.form.placeholder.input', { name: 'AppKey' })}
          />
        </Form.Item>
        <Form.Item
          label="AppSecret"
          name="appSecret"
          rules={[{ required: true }]}
        >
          <Input.Password
            disabled={!enable}
            placeholder={t('common.form.placeholder.input', {
              name: 'AppSecret',
            })}
          />
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

export default LarkSetting;
