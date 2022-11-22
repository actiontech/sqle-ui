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
      ready: !!projectName && bindProjects.length > 0,
    }
  );
  const renderProjectDetail = () => {
    /**
     * todo 临时处理
     * 目前方案存在问题: bindProjects 数据并不不具有实时性, 目前这样做仅仅为了处理当不存在项目时会存在接口的错误提示, 感觉不太友好
     * 后续调整方案: 后端改造 getProjectDetailV1 接口. 区分接口出现错误与当前用户未加入任何项目的情况, 这样便无需 bindProjects 数据.
     *
     * */
    if (bindProjects.length === 0) {
      return (
        <Result
          status="info"
          title={t('projectManage.projectDetail.notice')}
          subTitle={t('projectManage.projectDetail.unboundProjectTips')}
        />
      );
    }
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
