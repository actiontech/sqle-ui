import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  InputRef,
  Popover,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import { CustomTagsProps } from './index.type';
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo, useRef, useState } from 'react';
import useSQLAuditRecordTag from '../../../hooks/useSQLAuditRecordTag';
import { useTranslation } from 'react-i18next';
import useStyles from '../../../theme';
import EmptyBox from '../../../components/EmptyBox';
import { nameRule } from '../../../utils/FormRule';

const CustomTags: React.FC<CustomTagsProps> = ({
  tags,
  updateTags,
  projectName,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [extraTagForm] = Form.useForm<{ extraTag: string }>();

  const removing = useRef(false);
  const removeTag = async (tag: string) => {
    if (removing.current) {
      return;
    }

    updateTags(tags.filter((v) => v !== tag)).finally(() => {
      removing.current = false;
    });
  };

  const inputRef = useRef<InputRef>(null);
  const { loading, updateSQLAuditRecordTag, auditRecordTags } =
    useSQLAuditRecordTag();
  const [open, setOpen] = useState(false);
  const handelClickAddTagsIcon = () => {
    setOpen(true);
    updateSQLAuditRecordTag(projectName);
  };

  const content = useMemo(() => {
    const createTag = async (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      tag?: string
    ) => {
      e.preventDefault();
      let realTag = '';
      if (tag) {
        realTag = tag;
      } else {
        const values = await extraTagForm.validateFields();
        realTag = values.extraTag;
      }
      if (!realTag) {
        return;
      }
      if (tags.includes(realTag)) {
        message.error(t('sqlAudit.create.createTagErrorTips'));
        return;
      }
      updateTags([...tags, realTag]);

      extraTagForm.resetFields();

      setOpen(false);
    };
    return (
      <Spin spinning={loading}>
        <div>
          <EmptyBox
            if={auditRecordTags.length > 0}
            defaultNode={
              <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description={
                  <Typography.Text type="secondary">
                    {t('sqlAudit.create.baseInfo.notTags')}
                  </Typography.Text>
                }
              />
            }
          >
            {auditRecordTags.map((v) => (
              <div
                className={`${styles.optionsHover} custom-tag-item`}
                key={v}
                onClick={(e) => createTag(e, v)}
              >
                <Tag color="blue">{v}</Tag>
              </div>
            ))}
          </EmptyBox>

          <Divider />
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
        </div>
      </Spin>
    );
  }, [
    auditRecordTags,
    extraTagForm,
    loading,
    styles.optionsHover,
    t,
    tags,
    updateTags,
  ]);

  return (
    <Space>
      {tags.map((v) => (
        <Tag
          color="blue"
          key={v}
          closable
          onClose={(e) => {
            e.preventDefault();
            removeTag(v);
          }}
        >
          {v}
        </Tag>
      ))}

      <Popover
        trigger={['click']}
        open={open}
        onOpenChange={setOpen}
        content={content}
        overlayClassName="custom-tags-wrapper"
      >
        <PlusCircleOutlined
          className="pointer text-blue"
          onClick={handelClickAddTagsIcon}
        />
      </Popover>
    </Space>
  );
};

export default CustomTags;
