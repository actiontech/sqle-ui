import { useTheme } from '@material-ui/styles';
import { useRequest } from 'ahooks';
import { Card, Col, Row, Typography, Steps, Space, Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IWorkFlowStepTemplateResV1 } from '../../../api/common';
import workflow from '../../../api/workflow';
import EmptyBox from '../../../components/EmptyBox';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { Theme } from '../../../types/theme.type';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';

const WorkflowTemplateDetail = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [reviewSteps, setReviewSteps] = useState<IWorkFlowStepTemplateResV1[]>(
    []
  );
  const { projectName } = useCurrentProjectName();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const [execSteps, setExecSteps] = useState<IWorkFlowStepTemplateResV1>({
    assignee_user_name_list: [],
    desc: '',
  });

  const { data: workflowTemplate } = useRequest(
    () =>
      workflow.getWorkflowTemplateV1({
        project_name: projectName,
      }),
    {
      ready: !!projectName,
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  useEffect(() => {
    if (!!workflowTemplate) {
      const stepList = workflowTemplate?.workflow_step_template_list ?? [];
      if (stepList.length <= 1) {
        setExecSteps(stepList[0]);
        return;
      }
      const execStep = stepList.pop();
      setReviewSteps(stepList);
      if (execStep) {
        setExecSteps(execStep);
      }
    }
  }, [workflowTemplate]);

  return (
    <Card
      title={t('workflowTemplate.detail.title.wrapper')}
      extra={[
        <EmptyBox if={actionPermission} key="update-workflow-template">
          <Link
            to={`/project/${projectName}/progress/update/${workflowTemplate?.workflow_template_name}`}
          >
            <Button type="primary">
              {t('workflowTemplate.detail.updateTemplate')}
            </Button>
          </Link>
        </EmptyBox>,
      ]}
    >
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>
            {t('workflowTemplate.detail.title.step')}
          </Typography.Title>
          <Steps direction="vertical">
            <Steps.Step
              status="process"
              title={t('workflowTemplate.progressConfig.createStep.title')}
              description={t('workflowTemplate.progressConfig.createStep.desc')}
            />
            {reviewSteps.map((progressItem, index) => (
              <Steps.Step
                key={index}
                status="process"
                title={t('workflowTemplate.progressConfig.review.title')}
                subTitle={t('workflowTemplate.progressConfig.review.subTitle')}
                description={
                  <Space
                    size={theme.common.padding}
                    direction="vertical"
                    className="full-width-element"
                  >
                    <span>
                      {t('workflowTemplate.form.label.reviewUser')}
                      {' : '}
                      {progressItem.assignee_user_name_list?.join(',') ?? '--'}
                    </span>
                    <span>
                      <span className="text-black">
                        {t('workflowTemplate.form.label.reviewDesc')}
                        {' : '}
                      </span>
                      {progressItem.desc ?? '--'}
                    </span>
                  </Space>
                }
              />
            ))}
            <Steps.Step
              title={t('workflowTemplate.progressConfig.exec.title')}
              status="process"
              subTitle={t('workflowTemplate.progressConfig.exec.subTitle')}
              description={
                <Space
                  size={theme.common.padding}
                  direction="vertical"
                  className="full-width-element"
                >
                  <span>
                    {t('workflowTemplate.form.label.execUser')}
                    {' : '}
                    {execSteps.assignee_user_name_list?.join(',') ?? '--'}
                  </span>

                  <span>
                    <span className="text-black">
                      {t('workflowTemplate.form.label.reviewDesc')}
                      {' : '}
                    </span>
                    {execSteps.desc ?? '--'}
                  </span>
                </Space>
              }
            />
          </Steps>
        </Col>
      </Row>
    </Card>
  );
};

export default WorkflowTemplateDetail;
