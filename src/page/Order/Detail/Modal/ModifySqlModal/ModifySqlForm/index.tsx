import { Button, Form, Radio, RadioChangeEvent, Upload } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import EmptyBox from '../../../../../../components/EmptyBox';
import { ModalFormLayout } from '../../../../../../data/common';
import useChangeTheme from '../../../../../../hooks/useChangeTheme';
import useStyles from '../../../../../../theme';
import { getFileFromUploadChangeEvent } from '../../../../../../utils/Common';
import { SQLInputType } from '../../../../Create/SqlInfoForm';
import { ModifySqlFormProps } from './index.type';

const ModifySqlForm: React.FC<ModifySqlFormProps> = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { currentEditorTheme } = useChangeTheme();
  const [currentSQLInputType, setCurrentSQLInputTYpe] = React.useState(
    SQLInputType.manualInput
  );

  const currentSQLInputTypeChange = React.useCallback(
    (event: RadioChangeEvent) => {
      setCurrentSQLInputTYpe(event.target.value);
    },
    []
  );

  const removeFile = React.useCallback(() => {
    props.form.setFieldsValue({
      sqlFile: [],
    });
  }, [props.form]);

  return (
    <Form form={props.form} {...ModalFormLayout}>
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
