import { Button, Form, Radio, RadioChangeEvent, Upload } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import { SQLInputType, SqlStatementFields, SqlStatementFormProps } from '.';
import EmptyBox from '../../../components/EmptyBox';
import { PageFormLayout } from '../../../data/common';
import useChangeTheme from '../../../hooks/useChangeTheme';
import useMonacoEditor from '../../../hooks/useMonacoEditor';
import useStyles from '../../../theme';
import { getFileFromUploadChangeEvent } from '../../../utils/Common';

const SqlStatementForm: React.FC<SqlStatementFormProps> = ({
  form,
  isClearFormWhenChangeSqlType = false,
  sqlStatement,
  fieldName,
  hideUpdateMybatisFile = false,
}) => {
  const { t } = useTranslation();
  const theme = useStyles();
  const { currentEditorTheme } = useChangeTheme();

  const [currentSQLInputType, setCurrentSQLInputTYpe] = useState(
    SQLInputType.manualInput
  );

  const currentSQLInputTypeChange = (event: RadioChangeEvent) => {
    setCurrentSQLInputTYpe(event.target.value);
    if (isClearFormWhenChangeSqlType) {
      form.resetFields([
        generateFieldName('sql'),
        generateFieldName('sqlFile'),
        generateFieldName('mybatisFile'),
      ]);
    }
  };

  const removeFile = useCallback(
    (fileName: keyof SqlStatementFields) => {
      form.setFieldsValue({
        [fieldName ?? '0']: {
          [fileName]: [],
        },
      });
    },
    [fieldName, form]
  );

  const generateFieldName = (name: string) => {
    return [fieldName ?? '0', name];
  };

  const { editorDidMount } = useMonacoEditor(form, {
    formName: generateFieldName('sql'),
  });

  useEffect(() => {
    if (sqlStatement) {
      form.setFieldsValue({
        [fieldName ?? '0']: {
          sql: sqlStatement,
        },
      });
    }
  }, [fieldName, form, sqlStatement]);

  return (
    <>
      <Form.Item
        label={t('order.sqlInfo.uploadType')}
        name={generateFieldName('sqlInputType')}
        initialValue={SQLInputType.manualInput}
      >
        <Radio.Group onChange={currentSQLInputTypeChange}>
          <Radio value={SQLInputType.manualInput}>
            {t('order.sqlInfo.manualInput')}
          </Radio>
          <Radio value={SQLInputType.uploadFile}>
            {t('order.sqlInfo.uploadFile')}
          </Radio>
          <EmptyBox if={!hideUpdateMybatisFile}>
            <Radio value={SQLInputType.uploadMybatisFile}>
              {t('order.sqlInfo.updateMybatisFile')}
            </Radio>
          </EmptyBox>
        </Radio.Group>
      </Form.Item>
      <EmptyBox if={currentSQLInputType === SQLInputType.manualInput}>
        <Form.Item
          name={generateFieldName('sql')}
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
            options={{
              automaticLayout: true,
            }}
          />
        </Form.Item>
      </EmptyBox>
      <EmptyBox if={currentSQLInputType === SQLInputType.uploadFile}>
        <Form.Item
          label={t('order.sqlInfo.sqlFile')}
          valuePropName="fileList"
          name={generateFieldName('sqlFile')}
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
          label={t('order.sqlInfo.mybatisFile')}
          valuePropName="fileList"
          name={generateFieldName('mybatisFile')}
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
    </>
  );
};

export default SqlStatementForm;
