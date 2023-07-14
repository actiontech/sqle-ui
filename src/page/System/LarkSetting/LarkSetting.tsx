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
import { useForm } from 'antd/lib/form/Form';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormFields, TestFormFields } from '.';
import { TestFeishuConfigurationReqV1AccountTypeEnum } from '../../../api/common.enum';
import configuration from '../../../api/configuration';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import { phoneRule } from '../../../utils/FormRule';
import useConditionalConfig, {
  ReadOnlyConfigColumnsType,
  renderReadOnlyModeConfig,
} from '../hooks/useConditionalConfig';
import { IFeishuConfigurationV1 } from '../../../api/common';

const LarkSetting: React.FC = () => {
  const { t } = useTranslation();
  const [testForm] = useForm<TestFormFields>();

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

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const [receiveType, setReceiveType] =
    useState<TestFeishuConfigurationReqV1AccountTypeEnum>(
      TestFeishuConfigurationReqV1AccountTypeEnum.email
    );
  const testing = useRef(false);

  const handelClickModify = () => {
    startModify();
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
    if (testing.current) {
      return;
    }
    testing.current = true;
    const values = await testForm.validateFields();
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
        testing.current = false;
        testForm.resetFields();
        setReceiveType(TestFeishuConfigurationReqV1AccountTypeEnum.email);
      });
  };

  const handelClickCancel = () => {
    form.resetFields();
    modifyFinish();
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

  const { data: larkInfo, refresh: refreshLarkInfo } = useRequest(
    () =>
      configuration
        .getFeishuConfigurationV1()
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
          label: t('system.lark.enable'),
          span: 3,
          dataIndex: 'is_feishu_notification_enabled',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
        },
        {
          label: 'App ID',
          span: 3,
          dataIndex: 'app_id',
          hidden: !larkInfo?.is_feishu_notification_enabled,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          ),
        },
      ];
    }, [t, larkInfo]);

  return (
    <Card title={<>{t('system.title.lark')}</>}>
      <section hidden={modifyFlag}>
        {renderReadOnlyModeConfig({
          data: larkInfo ?? {},
          columns: readonlyColumnsConfig,
          extra: (
            <Space>
              <Popover
                trigger="click"
                open={testPopoverVisible}
                onOpenChange={(visible) => {
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
                  htmlType="submit"
                  type="primary"
                  loading={submitLoading}
                  disabled={!enabled}
                >
                  {t('system.lark.test')}
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
            label={t('system.lark.enable')}
            name="enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        ),
        configField: (
          <>
            <Form.Item
              label="App ID"
              name="appKey"
              rules={[{ required: true }]}
            >
              <Input
                placeholder={t('common.form.placeholder.input', {
                  name: 'App ID',
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
                  name: 'App Secret',
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
        submit: submitLarkConfig,
      })}
    </Card>
  );
};

export default LarkSetting;
