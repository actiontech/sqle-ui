import { useRequest } from 'ahooks';
import { Result } from 'antd';
import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Switch } from 'react-router-dom';
import { useCurrentProjectName } from '.';
import project from '../../../api/project';
import HeaderProgress from '../../../components/HeaderProgress';
import useRoutes from '../../../hooks/useRoutes';
import useUserInfo from '../../../hooks/useUserInfo';
import { projectDetailRouterConfig } from '../../../router/config';
import ProjectDetailLayout from './Layout';

const ProjectDetail: React.FC = () => {
  const { registerRouter } = useRoutes();
  const { projectName } = useCurrentProjectName();
  const { t } = useTranslation();

  const { getUserInfo, getUserInfoLoading, userInfo } = useUserInfo();

  const { data: projectInfo, loading: getProjectInfoLoading } = useRequest(
    () =>
      project
        .getProjectDetailV1({ project_name: projectName })
        .then((res) => res.data.data),
    {
      ready: !!projectName,
    }
  );

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  const renderProjectDetail = () => {
    if (getUserInfoLoading || getProjectInfoLoading) {
      return <HeaderProgress />;
    }
    if ((userInfo?.data.data?.bind_projects?.length ?? 0) === 0) {
      return (
        <Result
          status="info"
          title={t('projectManage.projectDetail.notice')}
          subTitle={t('projectManage.projectDetail.unboundProjectTips')}
        />
      );
    }

    return (
      <ProjectDetailLayout
        projectName={projectName}
        archive={!!projectInfo?.archived}
      >
        <Suspense fallback={<HeaderProgress />}>
          <Switch>
            {registerRouter(projectDetailRouterConfig)}
            <Redirect
              to={{
                pathname: `/project/${projectName}/overview`,
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
