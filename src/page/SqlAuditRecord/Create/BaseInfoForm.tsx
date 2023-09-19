import {
  Button,
  Divider,
  Form,
  Input,
  InputRef,
  Select,
  SelectProps,
  Tag,
  message,
} from 'antd';
import { PageFormLayout } from '../../../data/common';
import {
  BaseInfoFormFields,
  BaseInfoFormProps,
  BaseInfoFormRef,
} from './index.type';
import { useTranslation } from 'react-i18next';
import useSQLAuditRecordTag from '../../../hooks/useSQLAuditRecordTag';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { nameRule } from '../../../utils/FormRule';

const BaseInfoForm: React.ForwardRefRenderFunction<
  BaseInfoFormRef,
  BaseInfoFormProps
> = ({ projectName, form }, ref) => {
  const { t } = useTranslation();
  const inputRef = useRef<InputRef>(null);
  const [extraTagForm] = Form.useForm<{ extraTag: string }>();

  const { auditRecordTags, updateSQLAuditRecordTag } = useSQLAuditRecordTag();

  const [values, setValues] = useState<string[]>([]);

  const createTag = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    const { extraTag } = await extraTagForm.validateFields();
    if (!extraTag) {
      return;
    }
    if (values.includes(extraTag)) {
      message.error(t('sqlAudit.create.createTagErrorTips'));
      return;
    }

    setValues([...values, extraTag]);
    form.setFieldsValue({
      tags: [...values, extraTag],
    });

    extraTagForm.resetFields();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const tagRender: SelectProps['tagRender'] = (props) => {
    return (
      <Tag
        color="blue"
        closable={true}
        onClose={(e) => {
          setValues((values) => values.filter((v) => v !== props.value));
          form.setFieldsValue({
            tags: values.filter((v) => v !== props.value),
          });
        }}
      >
        {props.value}
      </Tag>
    );
  };

  const reset = useCallback(() => {
    form.resetFields();
    extraTagForm.resetFields();
    setValues([]);
  }, [extraTagForm, form]);

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  useEffect(() => {
    updateSQLAuditRecordTag(projectName);
  }, [projectName, updateSQLAuditRecordTag]);

  return (
    <Form<BaseInfoFormFields>
      form={form}
      {...PageFormLayout}
      scrollToFirstError
    >
      <Form.Item name="tags" label={t('sqlAudit.create.baseInfo.businessTag')}>
        <Select
          placeholder={t('common.form.placeholder.searchSelect', {
            name: t('sqlAudit.create.baseInfo.businessTag'),
          })}
          value={values}
          onChange={setValues}
          mode="multiple"
          tagRender={tagRender}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Form
                form={extraTagForm}
                layout="inline"
                style={{ padding: '4px 0 8px 12px' }}
              >
                <Form.Item name="extraTag" rules={[...nameRule()]}>
                  <Input
                    placeholder={t(
                      'sqlAudit.create.baseInfo.addExtraTagPlaceholder'
                    )}
                    ref={inputRef}
                  />
                </Form.Item>

                <Form.Item>
                  <Button icon={<PlusOutlined />} onClick={createTag}>
                    {t('sqlAudit.create.baseInfo.addTag')}
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        >
          {auditRecordTags.map((v) => (
            <Select.Option key={v} value={v}>
              <Tag color="blue">{v}</Tag>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default forwardRef(BaseInfoForm);
