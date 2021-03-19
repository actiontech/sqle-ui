import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Space,
  Typography,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../../../api/instance';
import EmptyBox from '../../../../components/EmptyBox';
import { ResponseCode } from '../../../../data/common';
import { DataSourceFormField } from '../index.type';

const DatabaseFormItem: React.FC<{
  form: FormInstance<DataSourceFormField>;
}> = (props) => {
  const { t } = useTranslation();
  const [
    loading,
    { setTrue: setLoadingTrue, setFalse: setLoadingFalse },
  ] = useBoolean();

  const [connectAble, { toggle: setConnectAble }] = useBoolean();
  const [initHide, { setFalse: setInitHideFalse }] = useBoolean(true);

  const testDatabaseConnect = React.useCallback(async () => {
    const values = await props.form.validateFields([
      'ip',
      'password',
      'port',
      'user',
    ]);
    setLoadingTrue();
    instance
      .checkInstanceIsConnectableV1({
        host: values.ip,
        port: `${values.port}`,
        user: values.user,
        password: values.password,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setConnectAble(!!res.data.data?.is_instance_connectable);
        }
      })
      .finally(() => {
        setInitHideFalse();
        setLoadingFalse();
      });
  }, [
    props.form,
    setConnectAble,
    setInitHideFalse,
    setLoadingFalse,
    setLoadingTrue,
  ]);

  return (
    <>
      <Form.Item
        label={t('dataSource.dataSourceForm.ip')}
        name="ip"
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dataSource.dataSourceForm.ip'),
            }),
          },
        ]}
      >
        <Input
          placeholder={t('common.form.placeholder.input', {
            name: t('dataSource.dataSourceForm.ip'),
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.port')}
        initialValue={3306}
        name="port"
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dataSource.dataSourceForm.port'),
            }),
          },
        ]}
      >
        <InputNumber
          min={1}
          max={65535}
          placeholder={t('common.form.placeholder.input', {
            name: t('dataSource.dataSourceForm.ip'),
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.user')}
        name="user"
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dataSource.dataSourceForm.user'),
            }),
          },
        ]}
      >
        <Input
          placeholder={t('common.form.placeholder.input', {
            name: t('dataSource.dataSourceForm.user'),
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.password')}
        name="password"
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dataSource.dataSourceForm.password'),
            }),
          },
        ]}
      >
        <Input.Password
          placeholder={t('common.form.placeholder.input', {
            name: t('dataSource.dataSourceForm.password'),
          })}
        />
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Space>
          <Button onClick={testDatabaseConnect} loading={loading}>
            {t('dataSource.dataSourceForm.testDatabaseConnection')}
          </Button>
          <EmptyBox if={!initHide}>
            {loading && (
              <Typography.Link>
                {t('dataSource.dataSourceForm.testing')}
              </Typography.Link>
            )}
            {!loading && connectAble && (
              <Typography.Text type="success">
                {t('dataSource.dataSourceForm.testSuccess')}
                <CheckCircleFilled />
              </Typography.Text>
            )}
            {!loading && !connectAble && (
              <Typography.Text type="danger">
                {t('dataSource.dataSourceForm.testFailed')}
                <CloseCircleFilled />
              </Typography.Text>
            )}
          </EmptyBox>
        </Space>
      </Form.Item>
    </>
  );
};

export default DatabaseFormItem;
