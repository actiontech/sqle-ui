import { useRequest } from 'ahooks';
import {
  Card,
  Col,
  Row,
  Typography,
  Steps,
  Space,
  Button,
  StepProps,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IWorkFlowStepTemplateResV1 } from '../../../api/common';
import workflow from '../../../api/workflow';
import EmptyBox from '../../../components/EmptyBox';
import IconTipsLabel from '../../../components/IconTipsLabel';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { auditLevelDictionary } from '../../../hooks/useStaticStatus/index.data';
import { IReduxState } from '../../../store';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { Link } from '../../../components/Link';

const WorkflowTemplateDetail = () => {
  const { t } = useTranslation();
  const [reviewSteps, setReviewSteps] = useState<IWorkFlowStepTemplateResV1[]>(
    []
  );
  const { projectName } = useCurrentProjectName();

  const projectIsArchive = useSelector(
    (state: IReduxState) => state.projectManage.archived
  );

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
      workflow
        .getWorkflowTemplateV1({
          project_name: projectName,
        })
        .then((res) => res.data.data),
    {
      ready: !!projectName,
    }
  );

  const renderReviewUser = (progressItem: IWorkFlowStepTemplateResV1) => {
    if (progressItem.assignee_user_name_list?.length === 0) {
      if (progressItem.approved_by_authorized) {
        return t(
          'workflowTemplate.progressConfig.review.reviewUserType.matchAudit'
        );
      }
      return '--';
    }

    return progressItem.assignee_user_name_list?.join(',') ?? '--';
  };

  const renderExecuteUser = (execSteps: IWorkFlowStepTemplateResV1) => {
    if (execSteps.assignee_user_name_list?.length === 0) {
      if (execSteps.execute_by_authorized) {
        return t(
          'workflowTemplate.progressConfig.exec.executeUserType.matchExecute'
        );
      }
      return '--';
    }
    return execSteps.assignee_user_name_list?.join(',') ?? '--';
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
        <EmptyBox
          if={actionPermission && !projectIsArchive}
          key="update-workflow-template"
        >
          <Link
            to={`project/${projectName}/progress/update/${workflowTemplate?.workflow_template_name}`}
          >
            <Button type="primary">
              {t('workflowTemplate.detail.updateTemplate')}
            </Button>
          </Link>
        </EmptyBox>,
      ]}
    >
      <Row>
        <Col span={24} style={{ marginBottom: 6 }}>
          <Space align="baseline" size={16}>
            <Typography.Title level={5}>
              {t('workflowTemplate.form.label.allowSubmitWhenLessAuditLevel')}
            </Typography.Title>
            <Typography.Text>
              {workflowTemplate?.allow_submit_when_less_audit_level
                ? t(
                    auditLevelDictionary[
                      workflowTemplate?.allow_submit_when_less_audit_level!
                    ]
                  )
                : ''}
            </Typography.Text>
          </Space>
        </Col>
        <Col span={24}>
          <Typography.Title level={5}>
            {t('workflowTemplate.detail.title.step')}
          </Typography.Title>
          <Steps
            direction="vertical"
            items={[
              {
                style: { marginBottom: 10 },
                status: 'process',
                title: t('workflowTemplate.progressConfig.createStep.title'),
                description: t(
                  'workflowTemplate.progressConfig.createStep.desc'
                ),
              },
              ...reviewSteps.map<StepProps>((progressItem, index) => ({
                style: { marginBottom: 10 },
                key: index,
                status: 'process',
                title: (
                  <>
                    {t('workflowTemplate.progressConfig.review.title')}
                    <IconTipsLabel
                      tips={t(
                        'workflowTemplate.progressConfig.review.subTitle'
                      )}
                      iconStyle={{ fontSize: 14, marginLeft: 6 }}
                    />
                  </>
                ),
                description: (
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
                ),
              })),
              {
                title: (
                  <>
                    {t('workflowTemplate.progressConfig.exec.title')}
                    <IconTipsLabel
                      tips={t('workflowTemplate.progressConfig.exec.subTitle')}
                      iconStyle={{ fontSize: 14, marginLeft: 6 }}
                    />
                  </>
                ),
                status: 'process',
                description: (
                  <Space
                    size={0}
                    direction="vertical"
                    className="full-width-element"
                  >
                    <span>
                      {t('workflowTemplate.form.label.execUser')}
                      {' : '}
                      {renderExecuteUser(execSteps)}
                    </span>
                    <span>
                      <span className="text-black">
                        {t('workflowTemplate.form.label.reviewDesc')}
                        {' : '}
                      </span>
                      {execSteps.desc ?? '--'}
                    </span>
                  </Space>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default WorkflowTemplateDetail;
