import { useRequest } from 'ahooks';
import { Result } from 'antd';
import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useCurrentProjectName } from '.';
import project from '../../../api/project';
import HeaderProgress from '../../../components/HeaderProgress';
import useUserInfo from '../../../hooks/useUserInfo';
import { updateProjectStatus } from '../../../store/projectManage';
import ProjectDetailLayout from './Layout';

const ProjectDetail: React.FC = () => {
  const { projectName } = useCurrentProjectName();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { getUserInfo, getUserInfoLoading, userInfo } = useUserInfo();

  const { data: projectInfo, loading: getProjectInfoLoading } = useRequest(
    () =>
      project.getProjectDetailV1({ project_name: projectName }).then((res) => {
        dispatch(updateProjectStatus(!!res.data.data?.archived));
        return res.data.data;
      }),
    {
      ready: !!projectName,
      refreshDeps: [projectName],
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
          <Outlet />
        </Suspense>
      </ProjectDetailLayout>
    );
  };

  return <>{renderProjectDetail()}</>;
};

export default ProjectDetail;
