import { Button, Card, Empty, Modal, Space, Typography, message } from 'antd';
import { RuleUnderstandProps } from './index.type';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../../../components/EmptyBox';
import { useBoolean } from 'ahooks';
import EditKnowledgeContent from './EditKnowledgeContent';
import FooterButtonWrapper from '../../../components/FooterButtonWrapper';
import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import rule_template from '../../../api/rule_template';
import { ResponseCode } from '../../../data/common';

const RuleUnderstand: React.FC<RuleUnderstandProps> = ({
  content,
  ruleName,
  refresh,
  dbType,
  loading,
  isAdmin,
  isCustomRule,
}) => {
  const { t } = useTranslation();
  const [modifyFlag, { setTrue: startModify, setFalse: modifyFinish }] =
    useBoolean();
  const [hasDirtyData, setHasDirtyData] = useState(false);
  const [editValue, setEditValue] = useState<string>();
  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const cancel = () => {
    if (hasDirtyData) {
      Modal.warning({
        content: t('ruleKnowledge.hasDirtyDataTips'),
        onOk: () => {
          modifyFinish();
          setHasDirtyData(false);
          setEditValue(content);
        },
        okCancel: true,
        okText: t('common.ok'),
      });
    } else {
      modifyFinish();
    }
  };
  const submit = () => {
    startSubmit();
    const request = isCustomRule
      ? rule_template.updateCustomRuleKnowledge({
          rule_name: ruleName,
          knowledge_content: editValue,
          db_type: dbType,
        })
      : rule_template.updateRuleKnowledge({
          rule_name: ruleName,
          knowledge_content: editValue,
          db_type: dbType,
        });

    request
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('ruleKnowledge.successTips'));
          setHasDirtyData(false);
          modifyFinish();
          refresh();
          setEditValue('');
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  useEffect(() => {
    if (modifyFlag) {
      setEditValue(content);
    }
  }, [content, modifyFlag]);

  return (
    <>
      <Card
        loading={loading}
        title={t('ruleKnowledge.ruleUnderstanding')}
        extra={
          <EmptyBox if={!modifyFlag && isAdmin}>
            <Button onClick={startModify} type="primary" disabled={loading}>
              {t('ruleKnowledge.edit')}
            </Button>
          </EmptyBox>
        }
      >
        {modifyFlag ? (
          <EditKnowledgeContent
            value={editValue}
            onChange={setEditValue}
            setHasDirtyData={setHasDirtyData}
          />
        ) : (
          <EmptyBox
            if={!!content}
            defaultNode={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Typography.Text type="secondary">
                    {t('ruleKnowledge.noData')}
                  </Typography.Text>
                }
              />
            }
          >
            <MDEditor.Markdown
              source={content}
              rehypePlugins={[rehypeSanitize]}
            />
          </EmptyBox>
        )}
      </Card>

      <EmptyBox if={modifyFlag}>
        <FooterButtonWrapper insideProject={false}>
          <Space>
            <Button disabled={submitLoading} onClick={cancel}>
              {t('common.cancel')}
            </Button>
            <Button disabled={submitLoading} type="primary" onClick={submit}>
              {t('common.submit')}
            </Button>
          </Space>
        </FooterButtonWrapper>
      </EmptyBox>
    </>
  );
};

export default RuleUnderstand;
