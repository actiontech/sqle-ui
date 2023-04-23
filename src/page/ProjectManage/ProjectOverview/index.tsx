import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Col, PageHeader, Row, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import project from '../../../api/project';
import statistic from '../../../api/statistic';
import EmptyBox from '../../../components/EmptyBox';
import useNavigate from '../../../hooks/useNavigate';
import { useCurrentProjectName } from '../ProjectDetail';
import ProjectInfoBox from './ProjectInfoBox';

const renderCard = ({
  title,
  handleClick,
  content = '--',
}: {
  title: string;
  handleClick: () => void;
  content?: number | string;
}) => {
  return (
    <Card
      title={title}
      hoverable={true}
      type="inner"
      bordered
      onClick={handleClick}
    >
      <Typography.Link>{content}</Typography.Link>
    </Card>
  );
};

const ProjectOverview: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName } = useCurrentProjectName();

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

  const {
    data: projectStatistics,
    loading: getProjectStatisticsLoading,
    refresh: refreshProjectStatistics,
  } = useRequest(
    () =>
      statistic
        .getProjectStatisticsV1({ project_name: projectName })
        .then((res) => res.data.data),
    {
      ready: !!projectName,
    }
  );

  const refresh = () => {
    refreshProjectInfo();
    refreshProjectStatistics();
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
            <SyncOutlined
              spin={getProjectInfoLoading || getProjectStatisticsLoading}
            />
          </Button>,
        ]}
      >
        <ProjectInfoBox projectInfo={projectInfo} />
      </PageHeader>

      <section className="padding-content">
        <EmptyBox if={!getProjectStatisticsLoading} defaultNode={<Spin />}>
          <Row gutter={[{ xs: 8, sm: 28, md: 28, lg: 48 }, 32]}>
            <Col className="gutter-row" span={8}>
              {renderCard({
                title: t('projectManage.projectOverview.orderTotal'),
                content: projectStatistics?.workflow_total,
                handleClick: () => {
                  navigate(`project/${projectName}/order`);
                },
              })}
            </Col>
            <Col className="gutter-row" span={8}>
              {renderCard({
                title: t('projectManage.projectOverview.auditPlanTotal'),
                content: projectStatistics?.audit_plan_total,
                handleClick: () => {
                  navigate(`project/${projectName}/auditPlan`);
                },
              })}
            </Col>
            <Col className="gutter-row" span={8}>
              {renderCard({
                title: t('projectManage.projectOverview.instanceTotal'),
                content: projectStatistics?.instance_total,
                handleClick: () => {
                  navigate(`project/${projectName}/data`);
                },
              })}
            </Col>
            <Col className="gutter-row" span={8}>
              {renderCard({
                title: t('projectManage.projectOverview.memberTotal'),
                content: projectStatistics?.member_total,
                handleClick: () => {
                  navigate(`project/${projectName}/member`);
                },
              })}
            </Col>
            <Col className="gutter-row" span={8}>
              {renderCard({
                title: t('projectManage.projectOverview.ruleTemplateTotal'),
                content: projectStatistics?.rule_template_total,
                handleClick: () => {
                  navigate(`project/${projectName}/rule/template`);
                },
              })}
            </Col>
            <Col className="gutter-row" span={8}>
              {renderCard({
                title: t('projectManage.projectOverview.whiteListTotal'),
                content: projectStatistics?.whitelist_total,
                handleClick: () => {
                  navigate(`project/${projectName}/whitelist`);
                },
              })}
            </Col>
          </Row>
        </EmptyBox>
      </section>
    </article>
  );
};

export default ProjectOverview;
