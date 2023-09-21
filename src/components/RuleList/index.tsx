import { Col, List, Tabs, TabsProps, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RuleListDefaultTabKey } from '../../data/common';
import { RuleListProps, TabRuleItem } from './index.type';
import RuleLevelIcon from './RuleLevelIcon';
import { Link } from '../Link';
import EmptyBox from '../EmptyBox';

const RuleList: React.FC<RuleListProps> = (props) => {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState(
    props.currentTab ?? RuleListDefaultTabKey
  );
  const tabChange = (activeKey: string) => {
    if (props.tabChange) {
      props.tabChange(activeKey);
    } else {
      setCurrentTab(activeKey);
    }
  };

  const tabRules = useMemo(() => {
    const map = new Map<string, TabRuleItem>();
    map.set(RuleListDefaultTabKey, {
      tabTitle: RuleListDefaultTabKey,
      rules: props.list,
      len: props.list?.length ?? 0,
    });
    if (props.allRuleTabs) {
      props.allRuleTabs.forEach((tab) => {
        map.set(tab, { tabTitle: tab, rules: [], len: 0 });
      });
    }

    props.list.forEach((rule) => {
      if (!rule.type) {
        return;
      }
      if (map.has(rule.type)) {
        const currentRuleItem = map.get(rule.type);
        if (currentRuleItem) {
          map.set(rule.type, {
            ...currentRuleItem,
            rules: [...(currentRuleItem.rules ?? []), rule],
            len: (currentRuleItem.len ?? 0) + 1,
          });
        }
      } else {
        map.set(rule.type, {
          tabTitle: rule.type,
          rules: [rule],
          len: 1,
        });
      }
    });

    return Array.from(map.values());
  }, [props.allRuleTabs, props.list]);

  const tabItems: TabsProps['items'] = tabRules.map((tab) => {
    return {
      key: tab.tabTitle,
      label: (
        <>
          {tab.tabTitle} {`(${tab.len})`}
        </>
      ),
      children: (
        <List
          className="rule-list-namespace"
          itemLayout="horizontal"
          dataSource={tab.rules}
          locale={{
            emptyText: t('ruleTemplate.ruleTemplateForm.emptyRule'),
          }}
          {...props.listProps}
          renderItem={(item) => (
            <List.Item actions={props.actions?.(item)}>
              <List.Item.Meta
                avatar={<RuleLevelIcon ruleLevel={item.level} />}
                title={item.desc}
                description={
                  <Tooltip
                    title={
                      <>
                        {item.annotation}
                        {/* IFTRUE_isEE */}
                        {'  '}
                        {/* 暂时不支持自定义规则 */}
                        <EmptyBox if={!item?.is_custom_rule && !!item?.db_type}>
                          <Link
                            to={`rule/knowledge/${item.rule_name}?db_type=${item?.db_type}`}
                          >
                            {t('common.showMore')}
                          </Link>
                        </EmptyBox>

                        {/* FITRUE_isEE */}
                      </>
                    }
                  >
                    <Typography.Text
                      ellipsis={true}
                      type="secondary"
                      style={{ maxWidth: 500 }}
                    >
                      {item.annotation}
                    </Typography.Text>
                  </Tooltip>
                }
              />
              <Col flex="20%">
                {item.params &&
                  item.params.map((v) => (
                    <div key={v.key}>
                      <span>{!!v.desc ? `${v.desc}: ` : ''}</span>
                      <span>{v.value ?? ''}</span>
                    </div>
                  ))}
              </Col>
            </List.Item>
          )}
        />
      ),
    };
  });

  useEffect(() => {
    if (props.currentTab) {
      setCurrentTab(props.currentTab);
    }
  }, [props.currentTab]);

  return <Tabs activeKey={currentTab} onChange={tabChange} items={tabItems} />;
};

export default RuleList;
