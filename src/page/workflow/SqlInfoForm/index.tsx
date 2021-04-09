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
import { RcFile } from 'antd/lib/upload/interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import instance from '../../../api/instance';
import EmptyBox from '../../../components/EmptyBox';
import TestDatabaseConnectButton from '../../../components/TestDatabaseConnectButton';
import { PageFormLayout, ResponseCode } from '../../../data/common';
import useChangeTheme from '../../../hooks/useChangeTheme';
import useInstance from '../../../hooks/useInstance';
import useInstanceSchema from '../../../hooks/useInstanceSchema';
import useStyles from '../../../theme';
import { SqlInfoFormFields, SqlInfoFormProps } from './index.type';

export enum SQLInputType {
  manualInput,
  uploadFile,
}

const SqlInfoForm: React.FC<SqlInfoFormProps> = (props) => {
  const { t } = useTranslation();
  const { currentEditorTheme } = useChangeTheme();
  const theme = useStyles();

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
    },
    []
  );

  const testDatabaseConnect = React.useCallback(async () => {
    testStart();
    instance
      .checkInstanceIsConnectableByNameV1({
        instance_name: props.form.getFieldInstance('instanceName'),
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setConnectAble(!!res.data.data?.is_instance_connectable);
          setConnectErrorMessage(res.data.data?.connect_error_message ?? '');
        }
      })
      .finally(() => {
        testFinish();
      });
  }, [props.form, setConnectAble, testFinish, testStart]);

  const beforeUpload = React.useCallback(
    (file: RcFile) => {
      props.form.setFieldsValue({
        sqlFile: [file],
      });
      return false;
    },
    [props.form]
  );

  const removeFile = React.useCallback(() => {
    props.form.setFieldsValue({
      sqlFile: [],
    });
  }, [props.form]);

  const submit = React.useCallback(
    (values: SqlInfoFormFields) => {
      startSubmit();
      props.submit(values).finally(() => {
        submitFinish();
      });
    },
    [props, startSubmit, submitFinish]
  );

  const getFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  React.useEffect(() => {
    updateInstanceList();
  }, [updateInstanceList]);

  const testConnectVisible = !!props.form.getFieldValue('instanceName');

  return (
    <>
      <Card title={t('workflow.sqlInfo.title')}>
        <Form form={props.form} {...PageFormLayout} onFinish={submit}>
          <Form.Item
            name="instanceName"
            label={t('workflow.sqlInfo.instanceName')}
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
                name: t('workflow.sqlInfo.instanceName'),
              })}
            >
              {generateInstanceSelectOption()}
            </Select>
          </Form.Item>
          <Form.Item label=" " colon={false} hidden={!testConnectVisible}>
            <TestDatabaseConnectButton
              onClickTestButton={testDatabaseConnect}
              loading={testLoading}
              connectAble={connectAble}
              connectDisableReason={connectErrorMessage}
            />
          </Form.Item>
          <Form.Item
            name="instanceSchema"
            label={t('workflow.sqlInfo.instanceSchema')}
          >
            <Select
              placeholder={t('common.form.placeholder.select')}
              showSearch
              allowClear
            >
              {generateInstanceSchemaSelectOption}
            </Select>
          </Form.Item>
          <Form.Item
            label={t('workflow.sqlInfo.uploadType')}
            name="sqlInputType"
            initialValue={SQLInputType.manualInput}
          >
            <Radio.Group onChange={currentSQLInputTypeChange}>
              <Radio value={SQLInputType.manualInput}>
                {t('workflow.sqlInfo.manualInput')}
              </Radio>
              <Radio value={SQLInputType.uploadFile}>
                {t('workflow.sqlInfo.uploadFile')}
              </Radio>
            </Radio.Group>
          </Form.Item>
          <EmptyBox if={currentSQLInputType === SQLInputType.manualInput}>
            <Form.Item
              name="sql"
              label={t('workflow.sqlInfo.sql')}
              initialValue="/* input your sql */"
              wrapperCol={{
                ...PageFormLayout.wrapperCol,
                className: theme.editor,
                style: {
                  paddingRight: 1,
                },
              }}
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
              label={t('workflow.sqlInfo.sqlFile')}
              valuePropName="fileList"
              name="sqlFile"
              getValueFromEvent={getFile}
            >
              <Upload
                accept=".sql"
                beforeUpload={beforeUpload}
                onRemove={removeFile}
              >
                <Button>{t('common.upload')}</Button>
              </Upload>
            </Form.Item>
          </EmptyBox>
          <Form.Item label=" " colon={false}>
            <Button htmlType="submit" type="primary" loading={submitLoading}>
              {t('workflow.sqlInfo.audit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default SqlInfoForm;
