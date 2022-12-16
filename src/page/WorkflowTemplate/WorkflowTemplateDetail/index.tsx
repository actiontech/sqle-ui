import { useRequest } from 'ahooks';
import { Card, Col, Row, Typography, Steps, Space, Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IWorkFlowStepTemplateResV1 } from '../../../api/common';
import workflow from '../../../api/workflow';
import EmptyBox from '../../../components/EmptyBox';
import IconTipsLabel from '../../../components/IconTipsLabel';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';

const WorkflowTemplateDetail = () => {
  const { t } = useTranslation();
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

  const renderReviewUser = (progressItem: IWorkFlowStepTemplateResV1) => {
    if (progressItem.assignee_user_name_list?.length === 0) {
      if (progressItem.approved_by_authorized) {
        return t('workflowTemplate.progressConfig.review.reviewUserType.match');
      }
      return '--';
    }

    return progressItem.assignee_user_name_list?.join(',') ?? '--';
  };

  const renderExecuteUser = (execSteps: IWorkFlowStepTemplateResV1) => {
    if (execSteps.assignee_user_name_list?.length === 0) {
    }
  };

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
              style={{ marginBottom: 10 }}
              status="process"
              title={t('workflowTemplate.progressConfig.createStep.title')}
              description={t('workflowTemplate.progressConfig.createStep.desc')}
            />
            {reviewSteps.map((progressItem, index) => (
              <Steps.Step
                style={{ marginBottom: 10 }}
                key={index}
                status="process"
                title={
                  <>
                    {t('workflowTemplate.progressConfig.review.title')}
                    <IconTipsLabel
                      tips={t(
                        'workflowTemplate.progressConfig.review.subTitle'
                      )}
                      iconStyle={{ fontSize: 14, marginLeft: 6 }}
                    />
                  </>
                }
                description={
                  <Space
                    size={0}
                    direction="vertical"
                    className="full-width-element"
                  >
                    <span>
                      {t('workflowTemplate.form.label.reviewUser')}
                      {' : '}
                      {renderReviewUser(progressItem)}
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
              title={
                <>
                  {t('workflowTemplate.progressConfig.exec.title')}
                  <IconTipsLabel
                    tips={t('workflowTemplate.progressConfig.exec.subTitle')}
                    iconStyle={{ fontSize: 14, marginLeft: 6 }}
                  />
                </>
              }
              status="process"
              description={
                <Space
                  size={0}
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
