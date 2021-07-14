import useRequest from '@ahooksjs/use-request';
import { useTheme } from '@material-ui/styles';
import {
  Card,
  Col,
  Descriptions,
  Divider,
  PageHeader,
  Row,
  Select,
  Space,
} from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../api/instance';
import ruleTemplate from '../../api/rule_template';
import EmptyBox from '../../components/EmptyBox';
import RuleList from '../../components/RuleList';
import useSyncRuleListTab from '../../components/RuleList/useSyncRuleListTab';
import useInstance from '../../hooks/useInstance';
import { Theme } from '../../types/theme.type';

const Rule = () => {
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { t } = useTranslation();
  const [instanceName, setInstanceName] = useState<string | undefined>(
    undefined
  );

  const theme = useTheme<Theme>();
  const { data: instanceRules, run: getInstanceRules } = useRequest(
    () =>
      instance.getInstanceRuleListV1({
        instance_name: instanceName ?? '',
      }),
    {
      manual: true,
      formatResult(res) {
        return res.data?.data ?? [];
      },
    }
  );

  const { data: allRules } = useRequest(
    ruleTemplate.getRuleListV1.bind(ruleTemplate),
    {
      formatResult(res) {
        return res.data?.data ?? [];
      },
    }
  );

  const disableRules = React.useMemo(() => {
    if (!instanceRules) {
      return allRules ?? [];
    }
    const all = allRules ?? [];
    return all.filter(
      (e) => !instanceRules.find((item) => item.rule_name === e.rule_name)
    );
  }, [allRules, instanceRules]);

  React.useEffect(() => {
    if (instanceName !== undefined) {
      getInstanceRules();
    }
  }, [getInstanceRules, instanceName]);

  React.useEffect(() => {
    updateInstanceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { tabKey, allTypes, tabChange } = useSyncRuleListTab(allRules);

  return (
    <>
      <PageHeader title={t('rule.pageTitle')} ghost={false}>
        {t('rule.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Space
          size={theme.common.padding}
          direction="vertical"
          className="full-width-element"
        >
          <Card>
            <Row align="middle">
              <Col span={3}>{t('rule.form.instance')}</Col>
              <Col span={5}>
                <Select
                  data-testid="instance-name"
                  value={instanceName}
                  onChange={setInstanceName}
                  placeholder={t('common.form.placeholder.select')}
                  className="full-width-element"
                  allowClear
                >
                  {generateInstanceSelectOption()}
                </Select>
              </Col>
            </Row>
          </Card>
          <EmptyBox if={!instanceName}>
            <Card title={t('rule.allRules')}>
              <RuleList list={allRules ?? []} />
            </Card>
          </EmptyBox>
          <EmptyBox if={!!instanceName}>
            <Card title={t('rule.instanceRuleList')}>
              <Descriptions
                title={t('rule.activeRules', { name: instanceName })}
              />
              <RuleList
                list={instanceRules ?? []}
                allRuleTabs={allTypes}
                currentTab={tabKey}
                tabChange={tabChange}
              />
              <Divider dashed />
              <Descriptions
                title={t('rule.disableRules', { name: instanceName })}
              />
              <RuleList
                list={disableRules ?? []}
                allRuleTabs={allTypes}
                currentTab={tabKey}
                tabChange={tabChange}
              />
            </Card>
          </EmptyBox>
        </Space>
      </section>
    </>
  );
};

export default Rule;
