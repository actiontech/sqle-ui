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
  Form,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import rule_template from '../../api/rule_template';
import ruleTemplate from '../../api/rule_template';
import EmptyBox from '../../components/EmptyBox';
import RuleList from '../../components/RuleList';
import useSyncRuleListTab from '../../components/RuleList/useSyncRuleListTab';
import { FilterFormColLayout, FilterFormRowLayout } from '../../data/common';
import { Theme } from '../../types/theme.type';
import useRuleFilterForm from './useRuleFilterForm';

const Rule = () => {
  const { t } = useTranslation();

  const {
    data: projectTemplateRules,
    loading: getProjectTemplateRulesLoading,
    run: getProjectTemplateRules,
  } = useRequest(
    (project?: string, ruleTemplate?: string) =>
      rule_template.getProjectRuleTemplateV1({
        rule_template_name: ruleTemplate ?? '',
        project_name: project ?? '',
      }),
    {
      manual: true,
      formatResult(res) {
        setDbType(res.data.data?.db_type ?? '');
        return res.data?.data?.rule_list ?? [];
      },
    }
  );

  const {
    data: globalTemplateRules,
    loading: getGlobalTemplateRulesLoading,
    run: getGlobalTemplateRules,
  } = useRequest(
    (ruleTemplate?: string) =>
      rule_template.getRuleTemplateV1({
        rule_template_name: ruleTemplate ?? '',
      }),
    {
      manual: true,
      formatResult(res) {
        setDbType(res.data.data?.db_type ?? '');
        return res.data?.data?.rule_list ?? [];
      },
    }
  );

  const {
    generateDriverSelectOptions,
    generateProjectSelectOption,
    generateRuleTemplateSelectOptions,
    projectName,
    projectNameChangeHandle,
    dbType,
    setDbType,
    ruleTemplateName,
    ruleTemplateNameChangeHandle,
  } = useRuleFilterForm(getProjectTemplateRules, getGlobalTemplateRules);

  const { data: allRules, loading: getAllRulesLoading } = useRequest(
    () =>
      ruleTemplate.getRuleListV1({
        filter_db_type: dbType,
      }),
    {
      ready: !!dbType,
      refreshDeps: [dbType],
      formatResult(res) {
        return res.data?.data ?? [];
      },
    }
  );

  const disableRules = React.useMemo(() => {
    const tempRules = projectName ? projectTemplateRules : globalTemplateRules;

    if (!tempRules) {
      return allRules ?? [];
    }
    const all = allRules ?? [];

    return all.filter(
      (e) => !tempRules.find((item) => item.rule_name === e.rule_name)
    );
  }, [allRules, globalTemplateRules, projectName, projectTemplateRules]);

  const theme = useTheme<Theme>();

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
            <Form>
              <Row {...FilterFormRowLayout}>
                <Col {...FilterFormColLayout}>
                  <Form.Item label={t('rule.form.project')}>
                    <Select
                      data-testid="project-name"
                      value={projectName}
                      onChange={projectNameChangeHandle}
                      placeholder={t('common.form.placeholder.select')}
                      className="middle-select"
                      allowClear
                      showSearch
                    >
                      {generateProjectSelectOption()}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...FilterFormColLayout}>
                  <Form.Item
                    tooltip={t('rule.form.ruleTemplateTips')}
                    label={t('rule.form.ruleTemplate')}
                  >
                    <Select
                      data-testid="rule-template-name"
                      value={ruleTemplateName}
                      onChange={ruleTemplateNameChangeHandle}
                      placeholder={t('common.form.placeholder.select')}
                      className="middle-select"
                      allowClear
                      showSearch
                    >
                      {generateRuleTemplateSelectOptions()}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...FilterFormColLayout}>
                  <Form.Item label={t('rule.form.dbType')}>
                    <Select
                      disabled={!!ruleTemplateName}
                      data-testid="database-type"
                      value={dbType}
                      onChange={setDbType}
                      placeholder={t('common.form.placeholder.select')}
                      className="middle-select"
                    >
                      {generateDriverSelectOptions()}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <EmptyBox if={!ruleTemplateName}>
            <Card title={t('rule.allRules')}>
              <RuleList
                list={allRules ?? []}
                listProps={{
                  loading: getAllRulesLoading,
                }}
              />
            </Card>
          </EmptyBox>
          <EmptyBox if={!!ruleTemplateName}>
            <Card title={t('rule.templateRuleList')}>
              <Descriptions
                title={t('rule.activeRules', { name: ruleTemplateName })}
              />
              <RuleList
                list={
                  (projectName ? projectTemplateRules : globalTemplateRules) ??
                  []
                }
                allRuleTabs={allTypes}
                currentTab={tabKey}
                tabChange={tabChange}
                listProps={{
                  loading:
                    getProjectTemplateRulesLoading ||
                    getGlobalTemplateRulesLoading,
                }}
              />
              <Divider dashed />
              <Descriptions
                title={t('rule.disableRules', { name: ruleTemplateName })}
              />
              <RuleList
                list={disableRules ?? []}
                allRuleTabs={allTypes}
                currentTab={tabKey}
                tabChange={tabChange}
                listProps={{
                  loading:
                    getProjectTemplateRulesLoading ||
                    getGlobalTemplateRulesLoading,
                }}
              />
            </Card>
          </EmptyBox>
        </Space>
      </section>
    </>
  );
};

export default Rule;
