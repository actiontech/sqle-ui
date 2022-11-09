import { Suspense } from 'react';
import { Redirect, Switch, useLocation } from 'react-router-dom';
import { ProjectDetailLocationStateType } from '.';
import HeaderProgress from '../../../components/HeaderProgress';
import useRoutes from '../../../hooks/useRoutes';
import { projectDetailRouterConfig } from '../../../router/config';
import ProjectDetailLayout from './Layout';

const ProjectDetail: React.FC = () => {
  const { registerRouter } = useRoutes();

  const location = useLocation<ProjectDetailLocationStateType>();
  return (
    <ProjectDetailLayout projectName={location.state?.projectName ?? ''}>
      <Suspense fallback={<HeaderProgress />}>
        <Switch>
          {registerRouter(projectDetailRouterConfig)}
          <Redirect to={{ pathname: '/order', state: location.state }} />
        </Switch>
      </Suspense>
    </ProjectDetailLayout>
  );
};

export default ProjectDetail;
