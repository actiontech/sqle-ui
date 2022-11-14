import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import CreateRuleTemplate from './CreateRuleTemplate';
import RuleTemplateList from './RuleTemplateList';
import UpdateRuleTemplate from './UpdateRuleTemplate';

const GlobalRuleTemplate = () => {
  const { t } = useTranslation();

  return (
    <article className="rule-template-page-namespace">
      <PageHeader title={t('ruleTemplate.pageTitle')} ghost={false}>
        {t('ruleTemplate.pageDescribe')}
      </PageHeader>
      <section className="padding-content">
        <Switch>
          <Route
            path="/global/rule/template"
            exact={true}
            component={RuleTemplateList}
          />
          <Route
            path="/global/rule/template/create"
            component={CreateRuleTemplate}
          />
          <Route
            path="/global/rule/template/update/:templateName"
            component={UpdateRuleTemplate}
          />
          <Redirect to="/global/rule/template" />
        </Switch>
      </section>
    </article>
  );
};

export default GlobalRuleTemplate;
