import { Col, List, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RuleListDefaultTabKey } from '../../data/common';
import { RuleListProps, TabRuleItem } from './index.type';
import RuleLevelIcon from './RuleLevelIcon';

const RuleList: React.FC<RuleListProps> = (props) => {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState(
    props.currentTab ?? RuleListDefaultTabKey
  );
  const [tabRules, setTabRules] = useState<TabRuleItem[]>([]);
  const tabChange = (activeKey: string) => {
    if (props.tabChange) {
      props.tabChange(activeKey);
    } else {
      setCurrentTab(activeKey);
    }
  };

  const generateTabRule = () => {
    const map = new Map<string, TabRuleItem>();
    map.set(RuleListDefaultTabKey, {
      tabTitle: RuleListDefaultTabKey,
      rules: props.list,
    });
    if (props.allRuleTabs) {
      props.allRuleTabs.forEach((tab) => {
        map.set(tab, { tabTitle: tab, rules: [] });
      });
    }
    props.list.forEach((rule) => {
      if (!rule.type) {
        return;
      }
      if (map.has(rule.type)) {
        map.get(rule.type)?.rules.push(rule);
      } else {
        map.set(rule.type, {
          tabTitle: rule.type,
          rules: [rule],
        });
      }
    });
    const values = Array.from(map.values()).sort((a, b) =>
      a.tabTitle > b.tabTitle ? 1 : -1
    );
    setTabRules(values);
  };

  useEffect(() => {
    generateTabRule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.list, props.allRuleTabs]);

  useEffect(() => {
    if (props.currentTab) {
      setCurrentTab(props.currentTab);
    }
  }, [props.currentTab]);

  return (
    <Tabs activeKey={currentTab} onChange={tabChange}>
      {tabRules.map((tab) => {
        return (
          <Tabs.TabPane tab={tab.tabTitle} key={tab.tabTitle}>
            <List
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
                  />
                  <Col flex="20%">
                    {item.value && (
                      <>
                        <div>
                          {t('ruleTemplate.ruleTemplateForm.ruleValue')}
                        </div>
                        <div>{item.value}</div>
                      </>
                    )}
                  </Col>
                </List.Item>
              )}
            />
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
};

export default RuleList;
