import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, Form, Input, InputNumber, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import EmptyBox from '../../../components/EmptyBox';
import IconTipsLabel from '../../../components/IconTipsLabel';
import { PageFormLayout, ResponseCode } from '../../../data/common';
import { renderReadOnlyModeConfig } from '../hooks/useConditionalConfig';

type GlobalConfigFields = {
  orderExpiredHours: number;
  operationRecordExpiredHours: number;
  url: string;
};

const GlobalSetting = () => {
  const { t } = useTranslation();
  const [
    modifyFlag,
    { setTrue: setModifyFlagTrue, setFalse: setModifyFlagFalse },
  ] = useBoolean(false);
  const [form] = useForm<GlobalConfigFields>();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const { data: globalConfig, refresh } = useRequest(() =>
    configuration.getSystemVariablesV1().then((res) => res?.data?.data ?? {})
  );

  const handelClickCancel = () => {
    form.resetFields();
    setModifyFlagFalse();
  };

  const handelClickModify = () => {
    setModifyFlagTrue();
    form.setFieldsValue({
      orderExpiredHours: globalConfig?.workflow_expired_hours ?? 720,
      operationRecordExpiredHours:
        globalConfig?.operation_record_expired_hours ?? 2160,
      url: globalConfig?.url,
    });
  };

  const submitGlobalConfig = (values: GlobalConfigFields) => {
    startSubmit();
    configuration
      .updateSystemVariablesV1({
        workflow_expired_hours: values.orderExpiredHours,
        operation_record_expired_hours: values.operationRecordExpiredHours,
        url: values.url,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          handelClickCancel();
          refresh();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  return (
    <Card title={t('system.title.global')}>
      <section hidden={modifyFlag}>
        {renderReadOnlyModeConfig({
          data: globalConfig ?? {},
          columns: [
            {
              label: t('system.global.orderExpiredHours'),
              span: 3,
              dataIndex: 'workflow_expired_hours',
              render: (val) => (
                <EmptyBox if={!!val} defaultNode="--">
                  {val}({t('common.time.hour')})
                </EmptyBox>
              ),
            },
            {
              label: t('system.global.operationRecordExpiredHours'),
              span: 3,
              dataIndex: 'operation_record_expired_hours',
              render: (val) => (
                <EmptyBox if={!!val} defaultNode="--">
                  {val}({t('common.time.hour')})
                </EmptyBox>
              ),
            },
            {
              label: (
                <IconTipsLabel tips={t('system.global.urlAddressPrefixTips')}>
                  {t('system.global.urlAddressPrefix')}
                </IconTipsLabel>
              ),
              span: 3,
              dataIndex: 'url',
            },
          ],
          extra: (
            <Button type="primary" onClick={handelClickModify}>
              {t('common.modify')}
            </Button>
          ),
        })}
      </section>
      <Form
        form={form}
        hidden={!modifyFlag}
        onFinish={submitGlobalConfig}
        {...PageFormLayout}
      >
        <Form.Item
          label={
            <>
              {t('system.global.orderExpiredHours')}({t('common.time.hour')})
            </>
          }
          name="orderExpiredHours"
          initialValue={'720'}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('system.global.orderExpiredHours'),
              }),
            },
            {
              type: 'integer',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label={
            <>
              {t('system.global.operationRecordExpiredHours')}(
              {t('common.time.hour')})
            </>
          }
          name="operationRecordExpiredHours"
          initialValue={'2160'}
          rules={[
            {
              type: 'integer',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          tooltip={t('system.global.urlAddressFormatTips')}
          label={t('system.global.urlAddressPrefix')}
          name="url"
        >
          <Input style={{ width: 200 }} />
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

export default GlobalSetting;
