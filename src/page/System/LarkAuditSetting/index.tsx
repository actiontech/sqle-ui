import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Col,
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
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import IconTipsLabel from '../../../components/IconTipsLabel';
import { ResponseCode } from '../../../data/common';
import useConditionalConfig, {
  ReadOnlyConfigColumnsType,
  renderReadOnlyModeConfig,
} from '../hooks/useConditionalConfig';
import { IFeishuConfigurationV1 } from '../../../api/common';
import { useMemo, useRef, useState } from 'react';
import { TestFeishuConfigurationReqV1AccountTypeEnum } from '../../../api/common.enum';
import EmptyBox from '../../../components/EmptyBox';
import { phoneRule } from '../../../utils/FormRule';

type FormFields = {
  enabled: boolean;
  appKey: string;
  appSecret: string;
};

type TestFormFields = {
  receiveType: TestFeishuConfigurationReqV1AccountTypeEnum;
  receivePhone: string;
  receiveEmail: string;
};

const LarkAuditSetting: React.FC = () => {
  const { t } = useTranslation();
  const {
    form,
    renderEditingModeConfig,
    startModify,
    modifyFinish,
    modifyFlag,
    enabled,
  } = useConditionalConfig<FormFields>({
    switchFieldName: 'enabled',
  });
  const [testForm] = Form.useForm<TestFormFields>();
  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const [receiveType, setReceiveType] =
    useState<TestFeishuConfigurationReqV1AccountTypeEnum>(
      TestFeishuConfigurationReqV1AccountTypeEnum.email
    );
  const testing = useRef(false);

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const handelClickModify = () => {
    startModify();
    form.setFieldsValue({
      enabled: !!larkAuditInfo?.is_feishu_notification_enabled,
      appKey: larkAuditInfo?.app_id,
    });
  };

  const submitLarkAuditConfig = (values: FormFields) => {
    startSubmit();
    configuration
      .updateFeishuAuditConfigurationV1({
        is_feishu_notification_enabled: values.enabled,
        app_id: values.appKey,
        app_secret: values.appSecret,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          handelClickCancel();
          refreshLarkAuditInfo();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const testLarkAuditConfiguration = async () => {
    if (testing.current) {
      return;
    }
    testing.current = true;
    const hide = message.loading(t('system.larkAudit.testing'), 0);

    const values = await testForm.validateFields();

    configuration
      .testFeishuAuditConfigV1({
        account:
          receiveType === TestFeishuConfigurationReqV1AccountTypeEnum.email
            ? values.receiveEmail
            : values.receivePhone,
        account_type: values.receiveType,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (res.data.data?.is_message_sent_normally) {
            message.success(t('system.larkAudit.testSuccess'));
          } else {
            message.error(
              res.data.data?.error_message ?? t('common.unknownError')
            );
          }
        }
      })
      .finally(() => {
        hide();
        testing.current = false;
        testForm.resetFields();
        setReceiveType(TestFeishuConfigurationReqV1AccountTypeEnum.email);
      });
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

  const handelClickCancel = () => {
    form.resetFields();
    modifyFinish();
  };

  const { data: larkAuditInfo, refresh: refreshLarkAuditInfo } = useRequest(
    () =>
      configuration
        .getFeishuAuditConfigurationV1()
        .then((res) => res.data.data ?? {}),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enabled: !!res.is_feishu_notification_enabled,
          });
        }
      },
    }
  );

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IFeishuConfigurationV1> =
    useMemo(() => {
      return [
        {
          label: t('system.larkAudit.enable'),
          span: 3,
          dataIndex: 'is_feishu_notification_enabled',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
        },
        {
          label: 'App ID',
          span: 3,
          dataIndex: 'app_id',
          hidden: !larkAuditInfo?.is_feishu_notification_enabled,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          ),
        },
      ];
    }, [t, larkAuditInfo]);

  return (
    <Card
      title={
        <>
          {t('system.title.larkAudit')}
          <IconTipsLabel
            iconStyle={{ fontSize: 14, marginLeft: 6 }}
            tips={t('system.larkAudit.titleTips')}
          />
        </>
      }
    >
      <section hidden={modifyFlag}>
        {renderReadOnlyModeConfig({
          data: larkAuditInfo ?? {},
          columns: readonlyColumnsConfig,
          extra: (
            <Space>
              <Popover
                trigger="click"
                open={testPopoverVisible}
                onOpenChange={(visible) => {
                  if (!enabled) {
                    return;
                  }
                  if (!visible) {
                    testForm.resetFields();
                    setReceiveType(
                      TestFeishuConfigurationReqV1AccountTypeEnum.email
                    );
                  }
                  toggleTestPopoverVisible(visible);
                }}
                content={
                  <Space direction="vertical" className="full-width-element">
                    <Form form={testForm}>
                      <Form.Item
                        name="receiveType"
                        label={t('system.larkAudit.receiveType')}
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
                            {t('system.larkAudit.email')}
                          </Radio>
                          <Radio
                            value={
                              TestFeishuConfigurationReqV1AccountTypeEnum.phone
                            }
                          >
                            {t('system.larkAudit.phone')}
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
                            label={t('system.larkAudit.email')}
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
                          label={t('system.larkAudit.phone')}
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
                          onClick={testLarkAuditConfiguration}
                        >
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
                  disabled={!enabled}
                >
                  {t('system.larkAudit.test')}
                </Button>
              </Popover>
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
            label={t('system.larkAudit.enable')}
            name="enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        ),
        configField: (
          <>
            <Form.Item
              label="APP ID"
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
              label="App Secret"
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
        submit: submitLarkAuditConfig,
      })}
    </Card>
  );
};

export default LarkAuditSetting;
