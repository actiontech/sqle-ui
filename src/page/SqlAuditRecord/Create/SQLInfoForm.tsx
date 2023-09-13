import {
  Button,
  Col,
  Form,
  FormItemProps,
  Radio,
  RadioGroupProps,
  Row,
  Select,
  Space,
  Tooltip,
  Upload,
} from 'antd';
import { PageFormLayout } from '../../../data/common';
import {
  AuditTypeEnum,
  SQLInfoFormFields,
  SQLInfoFormProps,
  UploadTypeEnum,
} from './index.type';
import { useTranslation } from 'react-i18next';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import { ComponentType, useEffect } from 'react';
import useStyles from '../../../theme';
import useChangeTheme from '../../../hooks/useChangeTheme';
import useMonacoEditor from '../../../hooks/useMonacoEditor';
import { getFileFromUploadChangeEvent } from '../../../utils/Common';
import { useBoolean } from 'ahooks';
import {
  FormatLanguageSupport,
  formatterSQL,
} from '../../../utils/FormatterSQL';
import useInstance from '../../../hooks/useInstance';
import useDatabaseType from '../../../hooks/useDatabaseType';
import useInstanceSchema from '../../../hooks/useInstanceSchema';
import { InfoCircleOutlined } from '@ant-design/icons';

const MonacoEditorFunComponent =
  MonacoEditor as ComponentType<MonacoEditorProps>;

const SQLInfoForm: React.FC<SQLInfoFormProps> = ({
  form,
  submit,
  projectName,
}) => {
  const { t } = useTranslation();
  const theme = useStyles();
  const { currentEditorTheme } = useChangeTheme();
  const { generateInstanceSelectOption, updateInstanceList, instanceList } =
    useInstance();
  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();

  const { editorDidMount } = useMonacoEditor(form, {
    formName: 'sql',
  });

  const uploadType = Form.useWatch('uploadType', form);
  const auditType = Form.useWatch('auditType', form);
  const instanceName = Form.useWatch('instanceName', form);

  const { updateSchemaList, generateInstanceSchemaSelectOption } =
    useInstanceSchema(projectName, instanceName);

  const removeFile = (
    fileName: keyof Pick<
      SQLInfoFormFields,
      'sqlFile' | 'mybatisFile' | 'zipFile'
    >
  ) => {
    form.setFieldsValue({
      [fileName]: [],
    });
  };

  const genUploadItem = (type: UploadTypeEnum): FormItemProps => {
    const uploadCommonProps: FormItemProps = {
      valuePropName: 'fileList',
      getValueFromEvent: getFileFromUploadChangeEvent,
      rules: [
        {
          required: true,
        },
      ],
    };
    if (type === UploadTypeEnum.sql) {
      return {
        name: 'sql',
        label: t('sqlAudit.create.SQLInfo.uploadLabelEnum.sql'),
        initialValue: '/* input your sql */',
        wrapperCol: {
          ...PageFormLayout.wrapperCol,
          className: theme.editor,
        },
        rules: [
          {
            required: true,
          },
        ],
        children: (
          <MonacoEditorFunComponent
            theme={currentEditorTheme}
            width="100%"
            height="500"
            language="sql"
            editorDidMount={editorDidMount}
            options={{
              automaticLayout: true,
            }}
          />
        ),
      };
    } else if (type === UploadTypeEnum.sqlFile) {
      return {
        name: 'sqlFile',
        label: t('sqlAudit.create.SQLInfo.uploadLabelEnum.sqlFile'),
        children: (
          <Upload
            accept=".sql"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'sqlFile')}
          >
            <Button>{t('common.upload')}</Button>
          </Upload>
        ),
        ...uploadCommonProps,
      };
    } else if (type === UploadTypeEnum.xmlFile) {
      return {
        name: 'mybatisFile',
        label: t('sqlAudit.create.SQLInfo.uploadLabelEnum.xmlFile'),
        children: (
          <Upload
            accept=".xml"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'mybatisFile')}
          >
            <Button>{t('common.upload')}</Button>
          </Upload>
        ),
        ...uploadCommonProps,
      };
    } else if (type === UploadTypeEnum.zipFile) {
      return {
        name: 'zipFile',
        label: t('sqlAudit.create.SQLInfo.uploadLabelEnum.zipFile'),
        children: (
          <Upload
            accept=".zip"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'zipFile')}
          >
            <Button>{t('common.upload')}</Button>
          </Upload>
        ),
        ...uploadCommonProps,
      };
    } else {
      return {};
    }
  };
  const uploadTypeChange: RadioGroupProps['onChange'] = () => {
    form.resetFields([
      'sql',
      'sqlFile',
      'mybatisFile',
      'zipFile',
      'gitRepository',
    ]);
  };

  const auditTypeChange: RadioGroupProps['onChange'] = () => {
    form.setFieldsValue({
      instanceName: undefined,
    });
  };

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const internalSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();

    submit(values).finally(() => {
      submitFinish();
    });
  };

  const formatter = async () => {
    const values = form.getFieldsValue();
    const dbType =
      auditType === AuditTypeEnum.dynamic
        ? instanceList.find((v) => v.instance_name === values.instanceName)
            ?.instance_type
        : values.dbType;

    const sql = formatterSQL(values.sql, dbType);
    form.setFieldsValue({
      sql,
    });
  };

  const handleInstanceNameChange = () => {
    form.setFieldsValue({ instanceSchema: undefined });
  };

  useEffect(() => {
    if (auditType === AuditTypeEnum.dynamic) {
      updateInstanceList({ project_name: projectName });
      updateSchemaList();
    } else if (auditType === AuditTypeEnum.static) {
      updateDriverNameList();
    }
  }, [
    auditType,
    projectName,
    updateDriverNameList,
    updateInstanceList,
    updateSchemaList,
  ]);

  return (
    <Form<SQLInfoFormFields> form={form} {...PageFormLayout} scrollToFirstError>
      <Form.Item
        name="auditType"
        label={t('sqlAudit.create.SQLInfo.auditType')}
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={AuditTypeEnum.dynamic}
      >
        <Radio.Group onChange={auditTypeChange}>
          <Radio value={AuditTypeEnum.static}>
            {t('sqlAudit.create.SQLInfo.staticAudit')}
          </Radio>
          <Radio value={AuditTypeEnum.dynamic}>
            {t('sqlAudit.create.SQLInfo.dynamicAudit')}
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        hidden={auditType === AuditTypeEnum.dynamic}
        label={t('sqlAudit.create.SQLInfo.dbType')}
        name="dbType"
        rules={[
          {
            required: auditType !== AuditTypeEnum.dynamic,
          },
        ]}
      >
        <Select>{generateDriverSelectOptions()}</Select>
      </Form.Item>

      <Form.Item noStyle hidden={auditType === AuditTypeEnum.static}>
        <Row>
          <Col span={12}>
            <Form.Item
              label={t('sqlAudit.create.SQLInfo.instanceName')}
              name="instanceName"
              labelCol={{
                xs: { span: 24 },
                sm: { span: 16 },
              }}
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 8 },
              }}
              rules={[
                {
                  required: auditType !== AuditTypeEnum.static,
                },
              ]}
            >
              <Select
                dropdownMatchSelectWidth={false}
                allowClear
                onChange={handleInstanceNameChange}
              >
                {generateInstanceSelectOption()}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              labelCol={{
                xs: { span: 24 },
                sm: { span: 8 },
              }}
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 24 },
              }}
              label={t('sqlAudit.create.SQLInfo.instanceSchema')}
              name="instanceSchema"
              rules={[
                {
                  required: auditType !== AuditTypeEnum.static,
                },
              ]}
            >
              <Select dropdownMatchSelectWidth={false} allowClear>
                {generateInstanceSchemaSelectOption()}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name="uploadType"
        label={t('sqlAudit.create.SQLInfo.uploadType')}
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={UploadTypeEnum.sql}
      >
        <Radio.Group onChange={uploadTypeChange}>
          <Radio value={UploadTypeEnum.sql}>
            {t('sqlAudit.create.SQLInfo.uploadTypeEnum.sql')}
          </Radio>
          <Radio value={UploadTypeEnum.sqlFile}>
            {t('sqlAudit.create.SQLInfo.uploadTypeEnum.sqlFile')}
          </Radio>
          <Radio value={UploadTypeEnum.xmlFile}>
            {t('sqlAudit.create.SQLInfo.uploadTypeEnum.xmlFile')}
          </Radio>
          <Radio value={UploadTypeEnum.zipFile}>
            {t('sqlAudit.create.SQLInfo.uploadTypeEnum.zipFile')}
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item {...genUploadItem(uploadType)} />

      <Form.Item label=" " colon={false}>
        <Space size={16}>
          <Button
            onClick={internalSubmit}
            type="primary"
            loading={submitLoading}
            disabled={submitLoading}
          >
            {t('sqlAudit.create.SQLInfo.auditButton')}
          </Button>

          <Space hidden={uploadType !== UploadTypeEnum.sql}>
            <Button
              onClick={formatter}
              loading={submitLoading}
              disabled={submitLoading}
            >
              {t('sqlAudit.create.SQLInfo.formatterSQL')}
            </Button>

            <Tooltip
              overlay={t('order.sqlInfo.formatTips', {
                supportType: Object.keys(FormatLanguageSupport).join('、'),
              })}
            >
              <InfoCircleOutlined className="text-orange" />
            </Tooltip>
          </Space>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SQLInfoForm;
