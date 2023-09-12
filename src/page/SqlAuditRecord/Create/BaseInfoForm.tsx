import {
  Button,
  Divider,
  Form,
  Input,
  InputRef,
  Select,
  SelectProps,
  Space,
  Tag,
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

const BaseInfoForm: React.ForwardRefRenderFunction<
  BaseInfoFormRef,
  BaseInfoFormProps
> = ({ projectName, form }, ref) => {
  const { t } = useTranslation();
  const inputRef = useRef<InputRef>(null);

  const { auditRecordTags, updateSQLAuditRecordTag } = useSQLAuditRecordTag();
  const [extraTag, setExtraTag] = useState('');
  const [extraTags, setExtraTags] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);

  const addTag = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    if (!extraTag || auditRecordTags.includes(extraTag)) {
      return;
    }

    setExtraTags((v) => [...v, extraTag]);
    setExtraTag('');
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
    setExtraTag('');
    setExtraTags([]);
    setValues([]);
  }, []);

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
      <Form.Item
        name="tags"
        label={t('sqlAudit.create.baseInfo.businessTag')}
        validateFirst={true}
        rules={[
          {
            required: true,
          },
        ]}
      >
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
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder={t(
                    'sqlAudit.create.baseInfo.addExtraTagPlaceholder'
                  )}
                  ref={inputRef}
                  value={extraTag}
                  onChange={(e) => setExtraTag(e.target.value)}
                />
                <Button icon={<PlusOutlined />} onClick={addTag}>
                  {t('sqlAudit.create.baseInfo.addTag')}
                </Button>
              </Space>
            </>
          )}
        >
          {[...auditRecordTags, ...extraTags].map((v) => (
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
