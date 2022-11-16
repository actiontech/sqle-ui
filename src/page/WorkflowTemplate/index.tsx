import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import UpdateWorkflowTemplate from './UpdateWorkflowTemplate';
import WorkflowTemplateDetail from './WorkflowTemplateDetail';
import { Redirect, Route, Switch } from 'react-router-dom';

const WorkflowTemplate = () => {
  const { t } = useTranslation();
  return (
    <article>
      <PageHeader title={t('workflowTemplate.pageTitle')} ghost={false}>
        {t('workflowTemplate.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Switch>
          <Route
            path="/project/:projectName/progress"
            exact={true}
            component={WorkflowTemplateDetail}
          />
          <Route
            path="/project/:projectName/progress/update/:workflowName"
            exact={true}
            component={UpdateWorkflowTemplate}
          />
          <Redirect to="/project/:projectName/progress" />
        </Switch>
      </section>
    </article>
  );
};

export default WorkflowTemplate;
