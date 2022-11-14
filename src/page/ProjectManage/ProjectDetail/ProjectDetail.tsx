import { Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import HeaderProgress from '../../../components/HeaderProgress';
import useRoutes from '../../../hooks/useRoutes';
import { projectDetailRouterConfig } from '../../../router/config';
import ProjectDetailLayout from './Layout';

const ProjectDetail: React.FC = () => {
  const { registerRouter } = useRoutes();

  return (
    <ProjectDetailLayout>
      <Suspense fallback={<HeaderProgress />}>
        <Switch>
          {registerRouter(projectDetailRouterConfig)}
          <Redirect to={{ pathname: '/order' }} />
        </Switch>
      </Suspense>
    </ProjectDetailLayout>
  );
};

export default ProjectDetail;
