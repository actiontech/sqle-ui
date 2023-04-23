import { Button, Card, Result, Row } from 'antd';
import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  IWorkFlowStepTemplateReqV1,
  IWorkflowTemplateDetailResV1,
} from '../../../api/common';
import { UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '../../../api/common.enum';
import workflow from '../../../api/workflow';
import { IUpdateWorkflowTemplateV1Return } from '../../../api/workflow/index.d';
import { ResponseCode } from '../../../data/common';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import WorkflowTemplateForm from '../WorkflowTemplateForm';
import { BaseFormFields } from '../WorkflowTemplateForm/BaseForm/index.type';
import { Link } from '../../../components/Link';

const UpdateWorkflowTemplate = () => {
  const { t } = useTranslation();
  const baseFormValue = useRef<BaseFormFields>();
  const [workflowTemplate, setWorkflowTemplate] =
    useState<IWorkflowTemplateDetailResV1>();
  const urlParams = useParams<{ workflowName: string }>();
  const { projectName } = useCurrentProjectName();

  const updateBaseInfo = (info: BaseFormFields) => {
    baseFormValue.current = info;
  };

  const submitProgress = (
    progressConfig: IWorkFlowStepTemplateReqV1[]
  ): Promise<AxiosResponse<IUpdateWorkflowTemplateV1Return>> => {
    return workflow.updateWorkflowTemplateV1({
      project_name: projectName,
      workflow_step_template_list: progressConfig,
      allow_submit_when_less_audit_level: baseFormValue.current
        ?.allowSubmitWhenLessAuditLevel as
        | UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
        | undefined,
    });
  };

  useEffect(() => {
    const getWorkflowProgress = () => {
      workflow
        .getWorkflowTemplateV1({ project_name: projectName })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const temp = res.data.data;
            if (temp?.workflow_step_template_list) {
              temp.workflow_step_template_list =
                temp.workflow_step_template_list.map((e) => {
                  if (e.approved_by_authorized) {
                    e.assignee_user_name_list = [];
                  }
                  return e;
                });
            }
            setWorkflowTemplate(res.data.data);
          }
        });
    };
    if (!!urlParams.workflowName) {
      getWorkflowProgress();
    }
  }, [projectName, urlParams]);

  return (
    <Card
      title={t('workflowTemplate.update.title.wrapper')}
      extra={[
        <Link to={`project/${projectName}/progress`} key="go-back">
          <Button type="primary">{t('common.back')}</Button>
        </Link>,
      ]}
    >
      <WorkflowTemplateForm
        defaultData={workflowTemplate}
        updateBaseInfo={updateBaseInfo}
        submitProgress={submitProgress}
        projectName={projectName}
      >
        <Result
          status="success"
          title={t('workflowTemplate.update.result.title')}
        />
        <Row justify="center">
          <Link to={`project/${projectName}/progress`}>
            <Button type="primary">
              {t('workflowTemplate.update.result.showNow')}
            </Button>
          </Link>
        </Row>
      </WorkflowTemplateForm>
    </Card>
  );
};

export default UpdateWorkflowTemplate;
