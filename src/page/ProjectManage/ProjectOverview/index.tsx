import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import project from '../../../api/project';
import { useCurrentProjectName } from '../ProjectDetail';
import ProjectInfoBox from './ProjectInfoBox';
import useResizeObserver from 'use-resize-observer';
import { Responsive, ResponsiveProps } from 'react-grid-layout';
import { ComponentType } from 'react';
import { useTheme } from '@mui/styles';
import { projectOverviewData } from './index.data';
import { ProjectOverviewPanelEnum } from './index.enum';
import {
  ApprovalProcess,
  AuditPlanClassification,
  DataSourceCount,
  MemberInfo,
  OrderClassification,
  OrderRisk,
  PanelCommonProps,
  ProjectScore,
  SqlCount,
} from './Panel';
import AuditPlanRisk from './Panel/AuditPlanRisk';
import { useDispatch, useSelector } from 'react-redux';
import { refreshProjectOverview } from '../../../store/projectManage';
import { IReduxState } from '../../../store';

const ResponsiveReactGridLayout = Responsive as ComponentType<ResponsiveProps>;
const { rowHeight, initialLayouts, gridLayoutCols } = projectOverviewData;

const ProjectOverview: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProjectName();
  const { ref, width = 0 } = useResizeObserver();
  const { currentTheme, language } = useSelector((state: IReduxState) => {
    return {
      currentTheme: state.user.theme,
      language: state.locale.language,
    };
  });
  const theme = useTheme();
  const dispatch = useDispatch();

  const {
    data: projectInfo,
    loading: getProjectInfoLoading,
    refresh: refreshProjectInfo,
  } = useRequest(
    () =>
      project
        .getProjectDetailV1({ project_name: projectName })
        .then((res) => res.data.data),
    {
      ready: !!projectName,
    }
  );

  const refresh = () => {
    dispatch(refreshProjectOverview());
    refreshProjectInfo();
  };

  const commonProps: PanelCommonProps = {
    projectName,
    commonPadding: theme.common.padding,
    language,
    currentTheme,
  };

  return (
    <article>
      <PageHeader
        title={t('projectManage.projectOverview.pageTitle')}
        ghost={false}
        extra={[
          <Button
            onClick={refresh}
            key="refresh-project-overview"
            data-testid="refresh-project-info"
          >
            <SyncOutlined spin={getProjectInfoLoading} />
          </Button>,
        ]}
      >
        <ProjectInfoBox projectInfo={projectInfo} />
      </PageHeader>

      <section ref={ref}>
        <ResponsiveReactGridLayout
          width={width}
          layouts={initialLayouts}
          cols={gridLayoutCols}
          rowHeight={rowHeight}
          margin={[theme.common.padding, theme.common.padding]}
          containerPadding={[theme.common.padding, theme.common.padding]}
        >
          <div key={ProjectOverviewPanelEnum.ProjectScore}>
            <ProjectScore {...commonProps} />
          </div>
          <div key={ProjectOverviewPanelEnum.SqlCount}>
            <SqlCount {...commonProps} />
          </div>
          <div key={ProjectOverviewPanelEnum.DataSourceCount}>
            <DataSourceCount {...commonProps} />
          </div>
          <div key={ProjectOverviewPanelEnum.OrderClassification}>
            <OrderClassification {...commonProps} />
          </div>
          <div key={ProjectOverviewPanelEnum.OrderRisk}>
            <OrderRisk
              projectName={projectName}
              commonPadding={theme.common.padding}
            />
          </div>
          <div key={ProjectOverviewPanelEnum.AuditPlanClassification}>
            <AuditPlanClassification {...commonProps} />
          </div>
          <div key={ProjectOverviewPanelEnum.AuditPlanRisk}>
            <AuditPlanRisk
              projectName={projectName}
              commonPadding={theme.common.padding}
            />
          </div>
          <div key={ProjectOverviewPanelEnum.MemberInfo}>
            <MemberInfo {...commonProps} />
          </div>
          <div key={ProjectOverviewPanelEnum.ApprovalProcess}>
            <ApprovalProcess {...commonProps} />
          </div>
        </ResponsiveReactGridLayout>
      </section>
    </article>
  );
};

export default ProjectOverview;
