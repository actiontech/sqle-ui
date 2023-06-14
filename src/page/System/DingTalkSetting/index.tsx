import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  Switch,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import IconTipsLabel from '../../../components/IconTipsLabel';
import { ResponseCode } from '../../../data/common';
import useConditionalConfig, {
  ReadOnlyConfigColumnsType,
  renderReadOnlyModeConfig,
} from '../hooks/useConditionalConfig';
import { IDingTalkConfigurationV1 } from '../../../api/common';
import { useMemo } from 'react';

type FormFields = {
  enabled: boolean;
  appKey: string;
  appSecret: string;
};

const DingTalkSetting: React.FC = () => {
  const { t } = useTranslation();
  const {
    form,
    renderEditingModeConfig,
    startModify,
    modifyFinish,
    modifyFlag,
  } = useConditionalConfig<FormFields>({
    switchFieldName: 'enabled',
  });
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const handelClickModify = () => {
    startModify();
    form.setFieldsValue({
      enabled: !!dingTalkInfo?.is_enable_ding_talk_notify,
      appKey: dingTalkInfo?.app_key,
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

  const testDingTalkConfiguration = () => {
    configuration.testDingTalkConfigV1().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        if (res.data.data?.is_ding_talk_send_normal) {
          message.success(t('system.dingTalk.testSuccess'));
        } else {
          message.error(
            res.data.data?.send_error_message ?? t('common.unknownError')
          );
        }
      }
    });
  };

  const handelClickCancel = () => {
    form.resetFields();
    modifyFinish();
  };

  const { data: dingTalkInfo, refresh: refreshDingTalkInfo } = useRequest(() =>
    configuration
      .getDingTalkConfigurationV1()
      .then((res) => res.data.data ?? {})
  );

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IDingTalkConfigurationV1> =
    useMemo(() => {
      return [
        {
          label: t('system.dingTalk.enable'),
          span: 3,
          dataIndex: 'is_enable_ding_talk_notify',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
        },
        {
          label: 'AppKey',
          span: 3,
          dataIndex: 'app_key',
          hidden: !dingTalkInfo?.is_enable_ding_talk_notify,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          ),
        },
      ];
    }, [t, dingTalkInfo]);

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
        {renderReadOnlyModeConfig({
          data: dingTalkInfo ?? {},
          columns: readonlyColumnsConfig,
          extra: (
            <Space>
              <Button
                type="primary"
                loading={submitLoading}
                onClick={testDingTalkConfiguration}
              >
                {t('system.dingTalk.test')}
              </Button>
              <Button type="primary" onClick={handelClickModify}>
                {t('common.modify')}
              </Button>
            </Space>
          ),
        })}
      </section>
      {renderEditingModeConfig({
        switchField: (
          <Form.Item
            label={t('system.dingTalk.enable')}
            name="enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        ),
        configField: (
          <>
            <Form.Item
              label="AppKey"
              name="appKey"
              rules={[{ required: true }]}
            >
              <Input
                placeholder={t('common.form.placeholder.input', {
                  name: 'AppKey',
                })}
              />
            </Form.Item>
            <Form.Item
              label="AppSecret"
              name="appSecret"
              rules={[{ required: true }]}
            >
              <Input.Password
                placeholder={t('common.form.placeholder.input', {
                  name: 'AppSecret',
                })}
              />
            </Form.Item>
          </>
        ),
        submitButtonField: (
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
        ),
        submit: submitDingTalkConfig,
      })}
    </Card>
  );
};

export default DingTalkSetting;
