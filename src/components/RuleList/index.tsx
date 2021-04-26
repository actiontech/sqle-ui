import { Col, List } from 'antd';
import { useTranslation } from 'react-i18next';
import { RuleListProps } from './index.type';
import RuleLevelIcon from './RuleLevelIcon';

const RuleList: React.FC<RuleListProps> = (props) => {
  const { t } = useTranslation();
  return (
    <List
      itemLayout="horizontal"
      dataSource={props.list}
      locale={{
        emptyText: t('ruleTemplate.ruleTemplateForm.emptyRule'),
      }}
      {...props.listProps}
      renderItem={(item) => (
        <List.Item actions={props.actions?.(item)}>
          <List.Item.Meta
            avatar={<RuleLevelIcon ruleLevel={item.level} />}
            title={item.rule_name}
            description={item.desc}
          />
          <Col flex="20%">
            {item.value && (
              <>
                <div>{t('ruleTemplate.ruleTemplateForm.ruleValue')}</div>
                <div>{item.value}</div>
              </>
            )}
          </Col>
        </List.Item>
      )}
    />
  );
};

export default RuleList;
