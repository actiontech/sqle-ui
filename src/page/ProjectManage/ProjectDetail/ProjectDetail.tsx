import { useRequest } from 'ahooks';
import { Result } from 'antd';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Switch } from 'react-router-dom';
import { useCurrentProjectName } from '.';
import project from '../../../api/project';
import HeaderProgress from '../../../components/HeaderProgress';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useRoutes from '../../../hooks/useRoutes';
import { projectDetailRouterConfig } from '../../../router/config';
import ProjectDetailLayout from './Layout';

const ProjectDetail: React.FC = () => {
  const { registerRouter } = useRoutes();
  const { projectName } = useCurrentProjectName();
  const { t } = useTranslation();
  const { bindProjects } = useCurrentUser();

  const { data, error, loading } = useRequest(
    () => project.getProjectDetailV1({ project_name: projectName }),
    {
      ready: !!projectName,
    }
  );

  const renderProjectDetail = () => {
    if (loading) {
      return <HeaderProgress />;
    }
    if (!!error) {
      return (
        <Result
          status="error"
          title={t('common.request.noticeFailTitle')}
          subTitle={error.message ?? t('common.unknownError')}
        />
      );
    }

    if (!data?.data.data) {
      if (bindProjects.length === 0) {
        return (
          <Result
            status="info"
            title={t('projectManage.projectDetail.notice')}
            subTitle={t('projectManage.projectDetail.unboundProjectTips')}
          />
        );
      }

      return (
        <Result
          status="error"
          title={t('common.request.noticeFailTitle')}
          subTitle={data?.data.message ?? t('common.unknownError')}
        />
      );
    }

    return (
      <ProjectDetailLayout
        projectName={projectName}
        projectInfo={data?.data.data}
      >
        <Suspense fallback={<HeaderProgress />}>
          <Switch>
            {registerRouter(projectDetailRouterConfig)}
            <Redirect
              to={{
                pathname: `/project/${projectName}/order`,
              }}
            />
          </Switch>
        </Suspense>
      </ProjectDetailLayout>
    );
  };

  return <>{renderProjectDetail()}</>;
};

export default ProjectDetail;
