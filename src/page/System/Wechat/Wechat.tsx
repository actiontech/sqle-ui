import { useBoolean, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Popover,
  Row,
  Space,
  Switch,
} from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import { ResponseCode } from '../../../data/common';
import useConditionalConfig, {
  ReadOnlyConfigColumnsType,
  renderReadOnlyModeConfig,
} from '../hooks/useConditionalConfig';
import { IWeChatConfigurationResV1 } from '../../../api/common';

type WechatFormFields = {
  enable_wechat_notify: boolean;
  corp_id: string;
  corp_secret: string;
  agent_id: string;
  safe_enabled: boolean;
  proxy_ip?: string;
};

const Wechat = () => {
  const { t } = useTranslation();

  const {
    data: wechatConfig,
    refresh,
    loading,
  } = useRequest(() =>
    configuration.getWeChatConfigurationV1().then((res) => res?.data?.data)
  );

  const {
    form,
    renderEditingModeConfig,
    startModify,
    modifyFinish,
    modifyFlag,
  } = useConditionalConfig<WechatFormFields>({
    switchFieldName: 'enable_wechat_notify',
  });

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const submit = (values: WechatFormFields) => {
    startSubmit();
    configuration
      .updateWeChatConfigurationV1({
        enable_wechat_notify: values.enable_wechat_notify,
        corp_id: values.corp_id,
        corp_secret: values.corp_secret,
        agent_id: values.agent_id
          ? Number.parseInt(values.agent_id ?? '0', 10)
          : undefined,
        safe_enabled: values.safe_enabled,
        proxy_ip: values.proxy_ip,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          refresh();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const handelClickModify = () => {
    form.setFieldsValue({
      enable_wechat_notify: wechatConfig?.enable_wechat_notify ?? false,
      corp_id: wechatConfig?.corp_id ?? '',
      agent_id: String(wechatConfig?.agent_id ?? 0),
      safe_enabled: wechatConfig?.safe_enabled ?? false,
      proxy_ip: wechatConfig?.proxy_ip ?? '',
    });
    startModify();
  };

  const [receiveId, setReceiveId] = useState('');
  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const testTing = useRef(false);
  const test = () => {
    if (testTing.current) {
      return;
    }
    testTing.current = true;
    toggleTestPopoverVisible(false);
    const hide = message.loading(
      t('system.wechat.testing', { id: receiveId }),
      0
    );
    configuration
      .testWeChatConfigurationV1({
        recipient_id: receiveId,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('system.wechat.testSuccess'));
        }
      })
      .finally(() => {
        hide();
        testTing.current = false;
      });
  };

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IWeChatConfigurationResV1> =
    useMemo(() => {
      return [
        {
          label: t('system.wechat.enable_wechat_notify'),
          span: 3,
          dataIndex: 'enable_wechat_notify',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
        },
        {
          label: t('system.wechat.corp_id'),
          span: 3,
          dataIndex: 'corp_id',
          hidden: !wechatConfig?.enable_wechat_notify,
        },
        {
          label: t('system.wechat.agent_id'),
          span: 3,
          dataIndex: 'agent_id',
          hidden: !wechatConfig?.enable_wechat_notify,
        },
        {
          label: t('system.wechat.safe_enabled'),
          span: 3,
          dataIndex: 'safe_enabled',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
          hidden: !wechatConfig?.enable_wechat_notify,
        },
        {
          label: t('system.wechat.proxy_ip'),
          span: 3,
          dataIndex: 'proxy_ip',
          hidden: !wechatConfig?.enable_wechat_notify,
        },
      ];
    }, [t, wechatConfig]);

  return (
    <Card loading={loading} title={t('system.title.wechat')}>
      <section hidden={modifyFlag}>
        {renderReadOnlyModeConfig<IWeChatConfigurationResV1>({
          data: wechatConfig ?? {},
          columns: readonlyColumnsConfig,
          extra: (
            <Space>
              <Popover
                trigger="click"
                open={testPopoverVisible}
                onOpenChange={(visible) => {
                  if (!visible) {
                    setReceiveId('');
                  }
                  toggleTestPopoverVisible(visible);
                }}
                content={
                  <Space direction="vertical" className="full-width-element">
                    <Row>
                      <Col span={8} className="flex-all-center">
                        {t('system.wechat.receiveWechat')}
                      </Col>
                      <Col span={16}>
                        <Input
                          data-testid="receivername"
                          value={receiveId}
                          onChange={(e) => setReceiveId(e.target.value)}
                        />
                      </Col>
                    </Row>
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
                  {t('system.wechat.test')}
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
            label={t('system.wechat.enable_wechat_notify')}
            name="enable_wechat_notify"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        ),
        configField: (
          <>
            <Form.Item
              label={t('system.wechat.corp_id')}
              name="corp_id"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('system.wechat.agent_id')}
              name="agent_id"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^\d*$/,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('system.wechat.corp_secret')}
              name="corp_secret"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label={t('system.wechat.safe_enabled')}
              name="safe_enabled"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item label={t('system.wechat.proxy_ip')} name="proxy_ip">
              <Input />
            </Form.Item>
          </>
        ),
        submitButtonField: (
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
        ),
        submit,
      })}
    </Card>
  );
};

export default Wechat;
