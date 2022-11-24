import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Card,
  Col,
  PageHeader,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import project from '../../../api/project';
import statistic from '../../../api/statistic';
import EmptyBox from '../../../components/EmptyBox';
import { useCurrentProjectName } from '../ProjectDetail';
import ProjectInfoBox from './ProjectInfoBox';

const ProjectOverview: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProjectName();

  const {
    data: projectInfo,
    loading: getProjectInfoLoading,
    refresh: refreshProjectInfo,
  } = useRequest(
    () => project.getProjectDetailV1({ project_name: projectName }),
    {
      ready: !!projectName,
      formatResult: (res) => {
        return res.data.data;
      },
    }
  );

  const {
    data: projectStatistics,
    loading: getProjectStatisticsLoading,
    refresh: refreshProjectStatistics,
  } = useRequest(
    () => statistic.getProjectStatisticsV1({ project_name: projectName }),
    {
      ready: !!projectName,
      formatResult: (res) => {
        return res.data.data;
      },
    }
  );

  const refresh = () => {
    refreshProjectInfo();
    refreshProjectStatistics();
  };

  const renderCard = (title: string, content?: number | string) => {
    return (
      <Card title={title} hoverable={true} type="inner" bordered>
        <Typography.Link>{content ?? '--'}</Typography.Link>
      </Card>
    );
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
          <Space
            direction="vertical"
            className="full-width-element"
            size="large"
          >
            <Row gutter={{ xs: 168, sm: 32, md: 48, lg: 64 }}>
              <Col className="gutter-row" span={8}>
                {renderCard(
                  t('projectManage.projectOverview.orderTotal'),
                  projectStatistics?.workflow_total
                )}
              </Col>
              <Col className="gutter-row" span={8}>
                {renderCard(
                  t('projectManage.projectOverview.auditPlanTotal'),
                  projectStatistics?.audit_plan_total
                )}
              </Col>
              <Col className="gutter-row" span={8}>
                {renderCard(
                  t('projectManage.projectOverview.instanceTotal'),
                  projectStatistics?.instance_total
                )}
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 32, md: 48, lg: 64 }}>
              <Col className="gutter-row" span={8}>
                {renderCard(
                  t('projectManage.projectOverview.memberTotal'),
                  projectStatistics?.member_total
                )}
              </Col>
              <Col className="gutter-row" span={8}>
                {renderCard(
                  t('projectManage.projectOverview.ruleTemplateTotal'),
                  projectStatistics?.rule_template_total
                )}
              </Col>
              <Col className="gutter-row" span={8}>
                {renderCard(
                  t('projectManage.projectOverview.whiteListTotal'),
                  projectStatistics?.whitelist_total
                )}
              </Col>
            </Row>
          </Space>
        </EmptyBox>
      </section>
    </article>
  );
};

export default ProjectOverview;
