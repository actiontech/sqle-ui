import { Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { useCurrentProjectName } from '.';
import HeaderProgress from '../../../components/HeaderProgress';
import useRoutes from '../../../hooks/useRoutes';
import { projectDetailRouterConfig } from '../../../router/config';
import ProjectDetailLayout from './Layout';

const ProjectDetail: React.FC = () => {
  const { registerRouter } = useRoutes();
  const { projectName } = useCurrentProjectName();
  return (
    <ProjectDetailLayout projectName={projectName}>
      <Suspense fallback={<HeaderProgress />}>
        <Switch>
          {registerRouter(projectDetailRouterConfig)}
          <Redirect to={{ pathname: '/order', state: { projectName } }} />
        </Switch>
      </Suspense>
    </ProjectDetailLayout>
  );
};

export default ProjectDetail;
