import { useBoolean } from 'ahooks';
import {
  Button,
  Card,
  Form,
  Radio,
  RadioChangeEvent,
  Select,
  Upload,
} from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import instance from '../../../../api/instance';
import EmptyBox from '../../../../components/EmptyBox';
import TestDatabaseConnectButton from '../../../../components/TestDatabaseConnectButton';
import { ResponseCode, PageFormLayout } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import useChangeTheme from '../../../../hooks/useChangeTheme';
import useInstance from '../../../../hooks/useInstance';
import useInstanceSchema from '../../../../hooks/useInstanceSchema';
import useStyles from '../../../../theme';
import { getFileFromUploadChangeEvent } from '../../../../utils/Common';
import EventEmitter from '../../../../utils/EventEmitter';
import { SqlInfoFormFields, SqlInfoFormProps } from './index.type';

export enum SQLInputType {
  manualInput,
  uploadFile,
  uploadMybatisFile,
}

const SqlInfoForm: React.FC<SqlInfoFormProps> = (props) => {
  const { t } = useTranslation();
  const { currentEditorTheme } = useChangeTheme();
  const theme = useStyles();
  const alreadySubmit = useRef(false);

  const [currentSQLInputType, setCurrentSQLInputTYpe] = React.useState(
    SQLInputType.manualInput
  );
  const [instanceName, setInstanceName] = React.useState<string | undefined>(
    undefined
  );
  const [
    submitLoading,
    { setTrue: startSubmit, setFalse: submitFinish },
  ] = useBoolean();

  const [connectAble, { toggle: setConnectAble }] = useBoolean();
  const [
    connectInitHide,
    { setTrue: setConnectInitHideTrue, setFalse: setConnectInitHideFalse },
  ] = useBoolean(true);
  const [
    testLoading,
    { setTrue: testStart, setFalse: testFinish },
  ] = useBoolean();
  const [connectErrorMessage, setConnectErrorMessage] = React.useState('');

  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { generateInstanceSchemaSelectOption } = useInstanceSchema(
    instanceName
  );

  const currentSQLInputTypeChange = React.useCallback(
    (event: RadioChangeEvent) => {
      setCurrentSQLInputTYpe(event.target.value);
      props.form.resetFields(['sql', 'sqlFile', 'mybatisFile']);
    },
    [props.form]
  );

  const testDatabaseConnect = React.useCallback(async () => {
    testStart();
    instance
      .checkInstanceIsConnectableByNameV1({
        instance_name: props.form.getFieldValue('instanceName'),
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setConnectAble(!!res.data.data?.is_instance_connectable);
          setConnectErrorMessage(res.data.data?.connect_error_message ?? '');
        }
      })
      .finally(() => {
        setConnectInitHideFalse();
        testFinish();
      });
  }, [
    props.form,
    setConnectAble,
    setConnectInitHideFalse,
    testFinish,
    testStart,
  ]);

  const removeFile = React.useCallback(
    (fileName: keyof SqlInfoFormFields) => {
      props.form.setFieldsValue({
        [fileName]: [],
      });
    },
    [props.form]
  );

  const submit = React.useCallback(
    (values: SqlInfoFormFields) => {
      startSubmit();
      props
        .submit(values)
        .then(() => {
          alreadySubmit.current = true;
          props.updateDirtyData(false);
        })
        .finally(() => {
          submitFinish();
        });
    },
    [props, startSubmit, submitFinish]
  );

  const formValueChange = React.useCallback(() => {
    if (alreadySubmit.current) {
      props.updateDirtyData(true);
    }
  }, [alreadySubmit, props]);

  React.useEffect(() => {
    updateInstanceList();
  }, [updateInstanceList]);

  React.useEffect(() => {
    const resetAlreadySubmit = () => {
      alreadySubmit.current = false;
      setInstanceName(undefined);
      setConnectInitHideTrue();
    };
    EventEmitter.subscribe(
      EmitterKey.Reset_Create_Order_Form,
      resetAlreadySubmit
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Create_Order_Form,
        resetAlreadySubmit
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const testConnectVisible = !!instanceName;

  return (
    <>
      <Card title={t('order.sqlInfo.title')}>
        <Form
          form={props.form}
          {...PageFormLayout}
          onFinish={submit}
          onValuesChange={formValueChange}
        >
          <Form.Item
            name="instanceName"
            label={t('order.sqlInfo.instanceName')}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select<string>
              onChange={setInstanceName}
              showSearch
              placeholder={t('common.form.placeholder.select', {
                name: t('order.sqlInfo.instanceName'),
              })}
            >
              {generateInstanceSelectOption()}
            </Select>
          </Form.Item>
          <Form.Item label=" " colon={false} hidden={!testConnectVisible}>
            <TestDatabaseConnectButton
              initHide={connectInitHide}
              onClickTestButton={testDatabaseConnect}
              loading={testLoading}
              connectAble={connectAble}
              connectDisableReason={connectErrorMessage}
            />
          </Form.Item>
          <Form.Item
            name="instanceSchema"
            label={t('order.sqlInfo.instanceSchema')}
          >
            <Select
              placeholder={t('common.form.placeholder.select')}
              showSearch
              allowClear
            >
              {generateInstanceSchemaSelectOption()}
            </Select>
          </Form.Item>
          <Form.Item
            label={t('order.sqlInfo.uploadType')}
            name="sqlInputType"
            initialValue={SQLInputType.manualInput}
          >
            <Radio.Group onChange={currentSQLInputTypeChange}>
              <Radio value={SQLInputType.manualInput}>
                {t('order.sqlInfo.manualInput')}
              </Radio>
              <Radio value={SQLInputType.uploadFile}>
                {t('order.sqlInfo.uploadFile')}
              </Radio>
              <Radio value={SQLInputType.uploadMybatisFile}>
                {t('order.sqlInfo.updateMybatisFile')}
              </Radio>
            </Radio.Group>
          </Form.Item>
          <EmptyBox if={currentSQLInputType === SQLInputType.manualInput}>
            <Form.Item
              name="sql"
              label={t('order.sqlInfo.sql')}
              initialValue="/* input your sql */"
              wrapperCol={{
                ...PageFormLayout.wrapperCol,
                className: theme.editor,
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <MonacoEditor
                theme={currentEditorTheme}
                width="100%"
                height="500"
                language="sql"
              />
            </Form.Item>
          </EmptyBox>
          <EmptyBox if={currentSQLInputType === SQLInputType.uploadFile}>
            <Form.Item
              label={t('order.sqlInfo.sqlFile')}
              valuePropName="fileList"
              name="sqlFile"
              rules={[
                {
                  required: true,
                },
              ]}
              getValueFromEvent={getFileFromUploadChangeEvent}
            >
              <Upload
                accept=".sql"
                beforeUpload={() => false}
                onRemove={removeFile.bind(null, 'sqlFile')}
              >
                <Button>{t('common.upload')}</Button>
              </Upload>
            </Form.Item>
          </EmptyBox>
          <EmptyBox if={currentSQLInputType === SQLInputType.uploadMybatisFile}>
            <Form.Item
              label={t('order.sqlInfo.updateMybatisFile')}
              valuePropName="fileList"
              name="mybatisFile"
              rules={[
                {
                  required: true,
                },
              ]}
              getValueFromEvent={getFileFromUploadChangeEvent}
            >
              <Upload
                accept=".xml"
                beforeUpload={() => false}
                onRemove={removeFile.bind(null, 'mybatisFile')}
              >
                <Button>{t('common.upload')}</Button>
              </Upload>
            </Form.Item>
          </EmptyBox>
          <Form.Item label=" " colon={false}>
            <Button htmlType="submit" type="primary" loading={submitLoading}>
              {t('order.sqlInfo.audit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default SqlInfoForm;
