import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import CreateWorkflowTemplate from './CreateWorkflowTemplate';
import UpdateWorkflowTemplate from './UpdateWorkflowTemplate';
import WorkflowTemplateDetail from './WorkflowTemplateDetail';
import WorkflowTemplateList from './WorkflowTemplateList';

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
            path="/progress"
            exact={true}
            component={WorkflowTemplateList}
          />
          <Route
            path="/progress/detail/:workflowName"
            exact={true}
            component={WorkflowTemplateDetail}
          />
          <Route
            path="/progress/create"
            exact={true}
            component={CreateWorkflowTemplate}
          />
          <Route
            path="/progress/update/:workflowName"
            exact={true}
            component={UpdateWorkflowTemplate}
          />
          <Redirect to="/progress" />
        </Switch>
      </section>
    </article>
  );
};

export default WorkflowTemplate;
