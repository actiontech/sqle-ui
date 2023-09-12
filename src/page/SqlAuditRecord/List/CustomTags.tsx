import {
  Button,
  Divider,
  Empty,
  Input,
  InputRef,
  Popover,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { CustomTagsProps } from './index.type';
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo, useRef, useState } from 'react';
import useSQLAuditRecordTag from '../../../hooks/useSQLAuditRecordTag';
import { useTranslation } from 'react-i18next';
import useStyles from '../../../theme';
import EmptyBox from '../../../components/EmptyBox';

const CustomTags: React.FC<CustomTagsProps> = ({
  tags,
  updateTags,
  projectName,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
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
  const [extraTag, setExtraTag] = useState('');
  const [extraTags, setExtraTags] = useState<string[]>([]);
  const handelClickAddTagsIcon = () => {
    setOpen(true);
    updateSQLAuditRecordTag(projectName);
  };

  const content = useMemo(() => {
    const addTag = async (tag: string) => {
      updateTags(tags.filter((v) => v !== tag));
      setOpen(false);
      setExtraTags((v) => []);
      setExtraTag('');
    };

    const createTag = (
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
    return (
      <Spin spinning={loading}>
        <div>
          <EmptyBox
            if={[...extraTags, ...auditRecordTags].length > 0}
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
            {[...extraTags, ...auditRecordTags].map((v) => (
              <div
                className={`${styles.optionsHover} custom-tag-item`}
                key={v}
                onClick={() => addTag(v)}
              >
                <Tag color="blue">{v}</Tag>
              </div>
            ))}
          </EmptyBox>

          <Divider />
          <Space className="add-tag-content">
            <Input
              placeholder={t('sqlAudit.create.baseInfo.addExtraTagPlaceholder')}
              ref={inputRef}
              value={extraTag}
              onChange={(e) => setExtraTag(e.target.value)}
            />
            <Button icon={<PlusOutlined />} onClick={createTag}>
              {t('sqlAudit.create.baseInfo.addTag')}
            </Button>
          </Space>
        </div>
      </Spin>
    );
  }, [
    auditRecordTags,
    extraTag,
    extraTags,
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
