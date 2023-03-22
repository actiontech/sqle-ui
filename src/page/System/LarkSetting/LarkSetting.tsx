import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Popover,
  Radio,
  RadioGroupProps,
  Row,
  Space,
  Switch,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormFields, TestFormFields } from '.';
import { TestFeishuConfigurationReqV1AccountTypeEnum } from '../../../api/common.enum';
import configuration from '../../../api/configuration';
import EmptyBox from '../../../components/EmptyBox';
import { PageFormLayout, ResponseCode } from '../../../data/common';
import { phoneRule } from '../../../utils/FormRule';

const LarkSetting: React.FC = () => {
  const { t } = useTranslation();
  const [
    testButtonDisabledStatus,
    { setFalse: finishTest, setTrue: startTest },
  ] = useBoolean(false);
  const [form] = useForm<FormFields>();
  const [testForm] = useForm<TestFormFields>();

  const [
    modifyFlag,
    { setTrue: setModifyFlagTrue, setFalse: setModifyFlagFalse },
  ] = useBoolean(false);
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [enable, setEnable] = useState(false);
  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const [receiveType, setReceiveType] =
    useState<TestFeishuConfigurationReqV1AccountTypeEnum>(
      TestFeishuConfigurationReqV1AccountTypeEnum.email
    );

  const handelClickModify = () => {
    setModifyFlagTrue();
    setEnable(!!larkInfo?.is_feishu_notification_enabled);
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

  const testLarkConfiguration = async () => {
    const values = await testForm.validateFields();
    startTest();
    toggleTestPopoverVisible(false);
    const hide = message.loading(t('system.lark.testing'), 0);
    configuration
      .testFeishuConfigV1({
        account:
          receiveType === TestFeishuConfigurationReqV1AccountTypeEnum.email
            ? values.receiveEmail
            : values.receivePhone,
        account_type: values.receiveType,
      })
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
        testForm.resetFields();
        setReceiveType(TestFeishuConfigurationReqV1AccountTypeEnum.email);
      });
  };

  const handelClickCancel = () => {
    form.resetFields();
    setEnable(false);
    setModifyFlagFalse();
  };

  const handleChangeReceiveType: RadioGroupProps['onChange'] = (e) => {
    const receiveType = e.target.value;
    setReceiveType(receiveType);

    if (receiveType === TestFeishuConfigurationReqV1AccountTypeEnum.email) {
      testForm.resetFields(['receivePhone']);
    } else {
      testForm.resetFields(['receiveEmail']);
    }
  };

  const { data: larkInfo, refresh: refreshLarkInfo } = useRequest(() =>
    configuration.getFeishuConfigurationV1().then((res) => res.data.data ?? {})
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
          <Descriptions.Item label="App ID" span={3}>
            <Typography.Paragraph>
              {larkInfo?.app_id || '--'}
            </Typography.Paragraph>
          </Descriptions.Item>
          <Descriptions.Item span={3}>
            <Space>
              <Popover
                trigger="click"
                visible={testPopoverVisible}
                onVisibleChange={(visible) => {
                  if (!visible) {
                    testForm.resetFields();
                  }
                  toggleTestPopoverVisible(visible);
                }}
                content={
                  <Space direction="vertical" className="full-width-element">
                    <Form form={testForm}>
                      <Form.Item
                        name="receiveType"
                        label={t('system.lark.receiveType')}
                        initialValue={
                          TestFeishuConfigurationReqV1AccountTypeEnum.email
                        }
                        style={{ marginBottom: 6 }}
                      >
                        <Radio.Group onChange={handleChangeReceiveType}>
                          <Radio
                            value={
                              TestFeishuConfigurationReqV1AccountTypeEnum.email
                            }
                          >
                            {t('system.lark.email')}
                          </Radio>
                          <Radio
                            value={
                              TestFeishuConfigurationReqV1AccountTypeEnum.phone
                            }
                          >
                            {t('system.lark.phone')}
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                      <EmptyBox
                        if={
                          receiveType ===
                          TestFeishuConfigurationReqV1AccountTypeEnum.phone
                        }
                        defaultNode={
                          <Form.Item
                            style={{ marginBottom: 0 }}
                            name="receiveEmail"
                            label={t('system.lark.email')}
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
                        }
                      >
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          name="receivePhone"
                          label={t('system.lark.phone')}
                          rules={[
                            {
                              required: true,
                            },
                            ...phoneRule(),
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </EmptyBox>
                    </Form>
                    <Row>
                      <Col span={24} style={{ textAlign: 'right' }}>
                        <Button
                          type="primary"
                          size="small"
                          onClick={testLarkConfiguration}
                        >
                          {t('common.ok')}
                        </Button>
                      </Col>
                    </Row>
                  </Space>
                }
              >
                <Button
                  type="primary"
                  loading={submitLoading}
                  disabled={testButtonDisabledStatus}
                >
                  {t('system.lark.test')}
                </Button>
              </Popover>
              <Button
                type="primary"
                onClick={handelClickModify}
                disabled={testButtonDisabledStatus}
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
        <Form.Item label="App ID" name="appKey" rules={[{ required: true }]}>
          <Input
            disabled={!enable}
            placeholder={t('common.form.placeholder.input', { name: 'App ID' })}
          />
        </Form.Item>
        <Form.Item
          label="App Secret"
          name="appSecret"
          rules={[{ required: true }]}
        >
          <Input.Password
            disabled={!enable}
            placeholder={t('common.form.placeholder.input', {
              name: 'App Secret',
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
