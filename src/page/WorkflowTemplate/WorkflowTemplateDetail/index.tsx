import { useTheme } from '@material-ui/styles';
import { useRequest } from 'ahooks';
import {
  Card,
  Col,
  Row,
  Typography,
  Descriptions,
  Steps,
  Space,
  Button,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { IWorkFlowStepTemplateResV1 } from '../../../api/common';
import workflow from '../../../api/workflow';
import { Theme } from '../../../types/theme.type';

const WorkflowTemplateDetail = () => {
  const urlParams = useParams<{ workflowName: string }>();
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [reviewSteps, setReviewSteps] = useState<IWorkFlowStepTemplateResV1[]>(
    []
  );
  const [execSteps, setExecSteps] = useState<IWorkFlowStepTemplateResV1>({
    assignee_user_name_list: [],
    desc: '',
  });

  const { data: workflowTemplate } = useRequest(
    () =>
      workflow.getWorkflowTemplateV1({
        workflow_template_name: urlParams.workflowName,
      }),
    {
      ready: !!urlParams.workflowName,
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
        <Link to="/progress" key="bo-back">
          <Button type="primary">{t('common.back')}</Button>
        </Link>,
      ]}
    >
      <Row>
        <Col span={8}>
          <Typography.Title level={5}>
            {t('workflowTemplate.detail.title.base')}
          </Typography.Title>
          <Descriptions>
            <Descriptions.Item
              label={t('workflowTemplate.form.label.name')}
              span={3}
            >
              {workflowTemplate?.workflow_template_name ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item
              label={t('workflowTemplate.form.label.desc')}
              span={3}
            >
              {workflowTemplate?.desc ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item
              label={t('workflowTemplate.form.label.instanceNameList')}
              span={3}
            >
              {workflowTemplate?.instance_name_list?.join(',') ?? '--'}
            </Descriptions.Item>
          </Descriptions>
          <Link
            to={`/progress/update/${workflowTemplate?.workflow_template_name}`}
          >
            <Button type="primary">
              {t('workflowTemplate.detail.updateTemplate')}
            </Button>
          </Link>
        </Col>
        <Col span={12}>
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
                  <Row>
                    <Col span={10}>
                      <Space
                        size={theme.common.padding}
                        direction="vertical"
                        className="full-width-element"
                      >
                        <Row>
                          <Col span={5}>
                            {t('workflowTemplate.form.label.reviewUser')}
                          </Col>
                          <Col span={18}>
                            {progressItem.assignee_user_name_list?.join(',') ??
                              '--'}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={5} className="text-black">
                            {t('workflowTemplate.form.label.reviewDesc')}
                          </Col>
                          <Col span={18}>{progressItem.desc ?? '--'}</Col>
                        </Row>
                      </Space>
                    </Col>
                  </Row>
                }
              />
            ))}
            <Steps.Step
              title={t('workflowTemplate.progressConfig.exec.title')}
              status="process"
              subTitle={t('workflowTemplate.progressConfig.exec.subTitle')}
              description={
                <Row>
                  <Col span={10}>
                    <Space
                      size={theme.common.padding}
                      direction="vertical"
                      className="full-width-element"
                    >
                      <Row>
                        <Col span={5}>
                          {t('workflowTemplate.form.label.execUser')}:
                        </Col>
                        <Col span={18}>
                          {execSteps.assignee_user_name_list?.join(',') ?? '--'}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={5} className="text-black">
                          {t('workflowTemplate.form.label.reviewDesc')}:
                        </Col>
                        <Col span={18}>{execSteps.desc ?? '--'}</Col>
                      </Row>
                    </Space>
                  </Col>
                </Row>
              }
            />
          </Steps>
        </Col>
      </Row>
    </Card>
  );
};

export default WorkflowTemplateDetail;
