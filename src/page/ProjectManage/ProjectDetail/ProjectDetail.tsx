import { useRequest } from 'ahooks';
import { Result } from 'antd';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { useCurrentProjectName } from '.';
import user from '../../../api/user';
import HeaderProgress from '../../../components/HeaderProgress';
import { ResponseCode, SystemRole } from '../../../data/common';
import useRoutes from '../../../hooks/useRoutes';
import { projectDetailRouterConfig } from '../../../router/config';
import {
  updateBindProjects,
  updateToken,
  updateUser,
} from '../../../store/user';
import ProjectDetailLayout from './Layout';

const ProjectDetail: React.FC = () => {
  const { registerRouter } = useRoutes();
  const { projectName } = useCurrentProjectName();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const clearUserInfo = () => {
    dispatch(updateBindProjects({ bindProjects: [] }));
    dispatch(
      updateUser({
        username: '',
        role: '',
      })
    );
    dispatch(
      updateToken({
        token: '',
      })
    );
  };

  const { loading, data } = useRequest(() => user.getCurrentUserV1(), {
    onSuccess: (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        const data = res.data.data;
        dispatch(
          updateBindProjects({ bindProjects: data?.bind_projects ?? [] })
        );
        dispatch(
          updateUser({
            username: data?.user_name ?? '',
            role: data?.is_admin ? SystemRole.admin : '',
          })
        );
      } else {
        clearUserInfo();
      }
    },
    onError: () => {
      clearUserInfo();
    },
  });

  const renderProjectDetail = () => {
    if (loading) {
      return <HeaderProgress />;
    }
    if ((data?.data.data?.bind_projects?.length ?? 0) === 0) {
      return (
        <Result
          status="info"
          title={t('projectManage.projectDetail.notice')}
          subTitle={t('projectManage.projectDetail.unboundProjectTips')}
        />
      );
    }

    return (
      <ProjectDetailLayout projectName={projectName}>
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
