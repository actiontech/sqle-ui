import { Result, Space, StepProps, Steps, Typography } from 'antd';
import PanelWrapper from './PanelWrapper';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../../components/Link';
import workflow from '../../../../api/workflow';
import { PanelCommonProps } from '.';
import { projectOverviewData } from '../index.data';
import { useMemo, useState } from 'react';
import usePanelCommonRequest from './usePanelCommonRequest';
import {
  IWorkFlowStepTemplateResV1,
  IWorkflowTemplateDetailResV1,
} from '../../../../api/common';

const { fourthLineSize, rowHeight } = projectOverviewData;

const ApprovalProcess: React.FC<PanelCommonProps> = ({
  projectName,
  commonPadding,
}) => {
  const { t } = useTranslation();

  const [workflowTemplate, setWorkflowTemplate] =
    useState<IWorkflowTemplateDetailResV1>();
  const [reviewSteps, setReviewSteps] = useState<IWorkFlowStepTemplateResV1[]>(
    []
  );
  const [execStep, setExecStep] = useState<IWorkFlowStepTemplateResV1>({
    assignee_user_name_list: [],
    desc: '',
  });

  const { loading, errorMessage } = usePanelCommonRequest(
    () =>
      workflow.getWorkflowTemplateV1({
        project_name: projectName,
      }),
    {
      onSuccess: (res) => {
        const workflowTemplate = res.data.data;
        setWorkflowTemplate(workflowTemplate);
        if (!!workflowTemplate) {
          const stepList = workflowTemplate?.workflow_step_template_list ?? [];
          if (stepList.length <= 1) {
            setExecStep(stepList[0]);
            return;
          }
          const execStep = stepList.pop();
          setReviewSteps(stepList);
          if (execStep) {
            setExecStep(execStep);
          }
        }
      },
    }
  );
  const height = useMemo(() => {
    return (
      rowHeight * fourthLineSize[1].h +
      commonPadding * (fourthLineSize[1].h - 1) -
      80
    );
  }, [commonPadding]);

  const genAssigneeUserName = (names: string[] = []) => {
    if (names.length === 0) {
      return t('projectManage.projectOverview.approvalProcess.match');
    }

    return (
      <Typography.Paragraph
        ellipsis={{
          expandable: false,
          tooltip: {
            title: names.join('、'),
          },
          rows: 2,
        }}
      >
        {names.join('、')}
      </Typography.Paragraph>
    );
  };

  return (
    <PanelWrapper
      error={
        errorMessage ? (
          <Result
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={errorMessage}
          />
        ) : null
      }
      loading={loading}
      title={
        <Space size={12}>
          <Typography.Text>
            {t('projectManage.projectOverview.approvalProcess.title')}
          </Typography.Text>
          <Link
            to={`project/${projectName}/progress/update/${workflowTemplate?.workflow_template_name}`}
            className="font-size-small"
          >
            {t('projectManage.projectOverview.approvalProcess.action')}
          </Link>
        </Space>
      }
    >
      <div className="flex-all-center" style={{ height: height }}>
        <Steps
          labelPlacement="vertical"
          items={[
            {
              title: t(
                'projectManage.projectOverview.approvalProcess.createStep'
              ),
              status: 'process',
            },
            ...reviewSteps.map<StepProps>((v) => ({
              title: t('projectManage.projectOverview.approvalProcess.review'),
              status: 'process',
              description: genAssigneeUserName(v?.assignee_user_name_list),
            })),
            {
              title: t('projectManage.projectOverview.approvalProcess.exec'),
              status: 'process',
              description: genAssigneeUserName(
                execStep?.assignee_user_name_list
              ),
            },
          ]}
        />
      </div>
    </PanelWrapper>
  );
};

export default ApprovalProcess;
