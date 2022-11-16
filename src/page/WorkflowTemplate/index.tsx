import { Card, PageHeader, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
/* IFTRUE_isEE */
import UpdateWorkflowTemplate from './UpdateWorkflowTemplate';
import WorkflowTemplateDetail from './WorkflowTemplateDetail';
/* FITRUE_isEE */
import { Redirect, Route, Switch } from 'react-router-dom';

const WorkflowTemplate = () => {
  const { t } = useTranslation();

  return (
    <article>
      <PageHeader title={t('workflowTemplate.pageTitle')} ghost={false}>
        {t('workflowTemplate.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        {/* IFTRUE_isCE */}
        <Card>
          {t('workflowTemplate.pageCeDesc')}
          <Typography.Paragraph>
            <ul>
              <li>
                <a href="https://actiontech.github.io/sqle-docs-cn/">
                  https://actiontech.github.io/sqle-docs-cn/
                </a>
              </li>
              <li>
                <a href="https://www.actionsky.com/">
                  https://www.actionsky.com/
                </a>
              </li>
            </ul>
          </Typography.Paragraph>
        </Card>
        {/* FITRUE_isCE */}
        {/* IFTRUE_isEE */}
        <Switch>
          <Route
            path="/progress/detail"
            exact={true}
            component={WorkflowTemplateDetail}
          />
          <Route
            path="/progress/update/:workflowName"
            exact={true}
            component={UpdateWorkflowTemplate}
          />
          <Redirect to="/progress/detail" />
        </Switch>
        {/* FITRUE_isEE */}
      </section>
    </article>
  );
};

export default WorkflowTemplate;
