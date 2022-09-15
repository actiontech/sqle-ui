import { Button, Form, Radio, RadioChangeEvent, Upload } from 'antd';
import { FormProps, useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import EmptyBox from '../../../../../../components/EmptyBox';
import { ModalFormLayout } from '../../../../../../data/common';
import useChangeTheme from '../../../../../../hooks/useChangeTheme';
import useMonacoEditor from '../../../../../../hooks/useMonacoEditor';
import useStyles from '../../../../../../theme';
import { getFileFromUploadChangeEvent } from '../../../../../../utils/Common';
import { SQLInputType } from '../../../../Create/index.enum';
import { ModifySqlFormFields, ModifySqlFormProps } from './index.type';

const ModifySqlForm: React.FC<ModifySqlFormProps> = ({
  currentTaskId,
  updateSqlFormInfo,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { currentEditorTheme } = useChangeTheme();
  const [currentSQLInputType, setCurrentSQLInputTYpe] = React.useState(
    SQLInputType.manualInput
  );
  const [form] = useForm<ModifySqlFormFields>();

  const { editorDidMount } = useMonacoEditor(form, { formName: 'sql' });

  const currentSQLInputTypeChange = React.useCallback(
    (event: RadioChangeEvent) => {
      setCurrentSQLInputTYpe(event.target.value);
    },
    []
  );

  const removeFile = React.useCallback(() => {
    form.setFieldsValue({
      sqlFile: [],
    });
  }, [form]);

  const onValuesChange: FormProps['onValuesChange'] = (
    _,
    values: ModifySqlFormFields
  ) => {
    updateSqlFormInfo(currentTaskId, values);
  };

  return (
    <Form form={form} {...ModalFormLayout} onValuesChange={onValuesChange}>
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
        </Radio.Group>
      </Form.Item>
      <EmptyBox if={currentSQLInputType === SQLInputType.manualInput}>
        <Form.Item
          name="sql"
          rules={[
            {
              required: true,
            },
          ]}
          label={t('order.sqlInfo.sql')}
          initialValue="/* input your sql */"
          wrapperCol={{
            ...ModalFormLayout.wrapperCol,
            className: styles.editor,
          }}
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
              message: t('common.form.rule.selectFile'),
            },
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
          extra={t('order.modifySql.sqlFileTips')}
        >
          <Upload
            accept=".sql"
            beforeUpload={() => false}
            onRemove={removeFile}
          >
            <Button>{t('common.upload')}</Button>
          </Upload>
        </Form.Item>
      </EmptyBox>
    </Form>
  );
};

export default ModifySqlForm;
