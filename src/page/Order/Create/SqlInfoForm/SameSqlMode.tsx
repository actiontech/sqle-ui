import { Button, Form, Radio, RadioChangeEvent, Upload } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import EmptyBox from '../../../../components/EmptyBox';
import { PageFormLayout } from '../../../../data/common';
import useChangeTheme from '../../../../hooks/useChangeTheme';
import useMonacoEditor from '../../../../hooks/useMonacoEditor';
import useStyles from '../../../../theme';
import { getFileFromUploadChangeEvent } from '../../../../utils/Common';
import { SQLInputType } from '../index.enum';
import { SameSqlModeProps, SqlInfoFormFields } from './index.type';

const SameSqlMode: React.FC<SameSqlModeProps> = ({
  submitLoading,
  submit,
  currentTabIndex,
}) => {
  const { currentEditorTheme } = useChangeTheme();
  const { t } = useTranslation();
  const [form] = useForm();
  const { editorDidMount } = useMonacoEditor(form, { formName: 'sql' });
  const theme = useStyles();

  const [currentSQLInputType, setCurrentSQLInputTYpe] = useState(
    SQLInputType.manualInput
  );

  const currentSQLInputTypeChange = useCallback(
    (event: RadioChangeEvent) => {
      setCurrentSQLInputTYpe(event.target.value);
      form.resetFields(['sql', 'sqlFile', 'mybatisFile']);
    },
    [form]
  );

  const removeFile = useCallback(
    (fileName: keyof SqlInfoFormFields) => {
      form.setFieldsValue({
        [fileName]: [],
      });
    },
    [form]
  );

  const onFinish = async () => {
    const values = await form.validateFields();
    submit(values, currentTabIndex);
  };

  return (
    <Form {...PageFormLayout} form={form}>
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
            editorDidMount={editorDidMount}
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
        <Button onClick={onFinish} type="primary" loading={submitLoading}>
          {t('order.sqlInfo.audit')}
        </Button>
      </Form.Item>
    </Form>
  );
};
export default SameSqlMode;
