import { InfoCircleOutlined } from '@ant-design/icons';
import { useTheme } from '@material-ui/styles';
import { useBoolean } from 'ahooks';
import {
  Form,
  FormInstance,
  Input,
  InputNumber,
  Space,
  Tooltip,
  Select,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../../../api/instance';
import EmptyBox from '../../../../components/EmptyBox';
import TestDatabaseConnectButton from '../../../../components/TestDatabaseConnectButton';
import { ResponseCode } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import { Theme } from '../../../../types/theme.type';
import EventEmitter from '../../../../utils/EventEmitter';
import { DataSourceFormField } from '../index.type';
import useDatabaseType from '../../../../hooks/useDatabaseType';

const DatabaseFormItem: React.FC<{
  form: FormInstance<DataSourceFormField>;
  isUpdate?: boolean;
  databaseTypeChange?: (values: string) => void;
}> = (props) => {
  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] =
    useBoolean();

  const [connectAble, { toggle: setConnectAble }] = useBoolean();
  const [connectErrorMessage, setConnectErrorMessage] = React.useState('');
  const [initHide, { setFalse: setInitHideFalse, setTrue: setInitHideTrue }] =
    useBoolean(true);

  const testDatabaseConnect = React.useCallback(async () => {
    const values = await props.form.validateFields([
      'ip',
      'password',
      'port',
      'user',
      'type',
    ]);
    setLoadingTrue();
    instance
      .checkInstanceIsConnectableV1({
        host: values.ip,
        port: `${values.port}`,
        user: values.user,
        db_type: values.type,
        password: values.password,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setConnectAble(!!res.data.data?.is_instance_connectable);
          setConnectErrorMessage(res.data.data?.connect_error_message ?? '');
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

  React.useEffect(() => {
    const resetConnectAbleStatus = () => {
      setInitHideTrue();
    };
    EventEmitter.subscribe(
      EmitterKey.Reset_Test_Data_Source_Connect,
      resetConnectAbleStatus
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Test_Data_Source_Connect,
        resetConnectAbleStatus
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  return (
    <>
      <Form.Item
        label={t('dataSource.dataSourceForm.type')}
        name="type"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={t('common.form.placeholder.select', {
            name: t('dataSource.dataSourceForm.type'),
          })}
          allowClear
          disabled={props.isUpdate}
          onChange={props.databaseTypeChange}
        >
          {generateDriverSelectOptions()}
        </Select>
      </Form.Item>
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
            name: t('dataSource.dataSourceForm.ipTips'),
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
        label={
          <Space>
            <EmptyBox if={props.isUpdate}>
              <Tooltip overlay={t('dataSource.dataSourceForm.passwordTips')}>
                <InfoCircleOutlined
                  style={{
                    color: theme.common.color.warning,
                  }}
                />
              </Tooltip>
            </EmptyBox>
            {t('dataSource.dataSourceForm.password')}
          </Space>
        }
        name="password"
        rules={[
          {
            required: !props.isUpdate,
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
        <TestDatabaseConnectButton
          initHide={initHide}
          onClickTestButton={testDatabaseConnect}
          loading={loading}
          connectAble={connectAble}
          connectDisableReason={connectErrorMessage}
        />
      </Form.Item>
    </>
  );
};

export default DatabaseFormItem;
