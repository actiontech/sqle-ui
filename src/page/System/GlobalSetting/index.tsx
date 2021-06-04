import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, Descriptions, Form, InputNumber, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';

type GlobalConfigFields = {
  orderExpiredHours: number;
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

  const { data: globalConfig, refresh } = useRequest(
    () => configuration.getSystemVariablesV1(),
    {
      formatResult(res) {
        return res?.data?.data ?? {};
      },
    }
  );

  const handelClickCancel = () => {
    form.resetFields();
    setModifyFlagFalse();
  };

  const handelClickModify = () => {
    setModifyFlagTrue();
    form.setFieldsValue({
      orderExpiredHours: globalConfig?.workflow_expired_hours ?? 720,
    });
  };

  const submitGlobalConfig = (values: GlobalConfigFields) => {
    startSubmit();
    configuration
      .updateSystemVariablesV1({
        workflow_expired_hours: values.orderExpiredHours,
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
        <Descriptions>
          <Descriptions.Item
            label={t('system.global.orderExpiredHours')}
            span={3}
          >
            <EmptyBox
              if={!!globalConfig?.workflow_expired_hours}
              defaultNode="--"
            >
              {globalConfig?.workflow_expired_hours}({t('common.time.hour')})
            </EmptyBox>
          </Descriptions.Item>
          <Descriptions.Item span={3}>
            <Button type="primary" onClick={handelClickModify}>
              {t('common.modify')}
            </Button>
          </Descriptions.Item>
        </Descriptions>
      </section>
      <Form form={form} hidden={!modifyFlag} onFinish={submitGlobalConfig}>
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
