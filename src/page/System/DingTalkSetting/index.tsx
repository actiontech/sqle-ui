import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Space,
  Switch,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import IconTipsLabel from '../../../components/IconTipsLabel';
import { PageFormLayout, ResponseCode } from '../../../data/common';

type FormFields = {
  enabled: boolean;
  appKey: string;
  appSecret: string;
};

const DingTalkSetting: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm<FormFields>();
  const [
    modifyFlag,
    { setTrue: setModifyFlagTrue, setFalse: setModifyFlagFalse },
  ] = useBoolean(false);
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const handelClickModify = () => {
    setModifyFlagTrue();
    form.setFieldsValue({
      enabled: !!dingTalkInfo?.is_enable_ding_talk_notify,
      appKey: dingTalkInfo?.app_key,
      appSecret: dingTalkInfo?.app_secret,
    });
  };

  const submitDingTalkConfig = (values: FormFields) => {
    startSubmit();
    configuration
      .updateDingTalkConfigurationV1({
        is_enable_ding_talk_notify: values.enabled,
        app_key: values.appKey,
        app_secret: values.appSecret,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          handelClickCancel();
          refreshDingTalkInfo();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const handelClickCancel = () => {
    form.resetFields();
    setModifyFlagFalse();
  };

  const { data: dingTalkInfo, refresh: refreshDingTalkInfo } = useRequest(
    () => configuration.getDingTalkConfigurationV1(),
    {
      formatResult(res) {
        return res.data.data ?? {};
      },
    }
  );

  return (
    <Card
      title={
        <>
          {t('system.title.dingTalk')}
          <IconTipsLabel
            iconStyle={{ fontSize: 14, marginLeft: 6 }}
            tips={t('system.dingTalk.titleTips')}
          />
        </>
      }
    >
      <section hidden={modifyFlag}>
        <Descriptions>
          <Descriptions.Item label={t('system.dingTalk.enable')} span={3}>
            {dingTalkInfo?.is_enable_ding_talk_notify
              ? t('common.open')
              : t('common.close')}
          </Descriptions.Item>
          <Descriptions.Item label="AppKey" span={3}>
            <Typography.Paragraph>
              {dingTalkInfo?.app_key ?? '--'}
            </Typography.Paragraph>
          </Descriptions.Item>
          <Descriptions.Item span={3}>
            <Button type="primary" onClick={handelClickModify}>
              {t('common.modify')}
            </Button>
          </Descriptions.Item>
        </Descriptions>
      </section>
      <Form
        form={form}
        hidden={!modifyFlag}
        onFinish={submitDingTalkConfig}
        {...PageFormLayout}
      >
        <Form.Item
          label={t('system.dingTalk.enable')}
          name="enabled"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item label="AppKey" name="appKey" rules={[{ required: true }]}>
          <Input
            placeholder={t('common.form.placeholder.input', { name: 'AppKey' })}
          />
        </Form.Item>
        <Form.Item
          label="AppSecret"
          name="appSecret"
          rules={[{ required: true }]}
        >
          <Input
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

export default DingTalkSetting;
