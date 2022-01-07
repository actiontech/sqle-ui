import { Button, Card, Result, Row, Typography } from 'antd';
import { AxiosResponse } from 'axios';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IWorkFlowStepTemplateReqV1 } from '../../../api/common';
import workflow from '../../../api/workflow';
import { ICreateWorkflowTemplateV1Return } from '../../../api/workflow/index.d';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import WorkflowTemplateForm from '../WorkflowTemplateForm';
import { BaseFormFields } from '../WorkflowTemplateForm/BaseForm/index.type';

const CreateWorkflowTemplate = () => {
  const { t } = useTranslation();
  const baseFormValue = useRef<BaseFormFields>();

  const updateBaseInfo = (info: BaseFormFields) => {
    baseFormValue.current = info;
  };

  const submitProgress = (
    progressConfig: IWorkFlowStepTemplateReqV1[]
  ): Promise<AxiosResponse<ICreateWorkflowTemplateV1Return>> => {
    return workflow.createWorkflowTemplateV1({
      workflow_template_name: baseFormValue.current?.name,
      desc: baseFormValue.current?.desc,
      instance_name_list: baseFormValue.current?.instanceNameList,
      workflow_step_template_list: progressConfig,
      allow_submit_when_less_audit_level:
        baseFormValue.current?.allowSubmitWhenLessAuditLevel,
    });
  };

  const resetAllForm = () => {
    EventEmitter.emit(EmitterKey.Reset_Workflow_Template_Form);
  };

  return (
    <Card
      title={t('workflowTemplate.create.title.wrapper')}
      extra={[
        <Link to="/progress" key="go-back">
          <Button type="primary">{t('common.back')}</Button>
        </Link>,
      ]}
    >
      <WorkflowTemplateForm
        updateBaseInfo={updateBaseInfo}
        submitProgress={submitProgress}
      >
        <Result
          status="success"
          title={t('workflowTemplate.create.result.title')}
          subTitle={
            <Typography.Link
              type="secondary"
              className="pointer"
              onClick={resetAllForm}
            >
              {t('workflowTemplate.create.result.createNew')}
            </Typography.Link>
          }
        />
        <Row justify="center">
          <Link to="/progress">
            <Button type="primary">
              {t('workflowTemplate.create.result.backToList')}
            </Button>
          </Link>
        </Row>
      </WorkflowTemplateForm>
    </Card>
  );
};

export default CreateWorkflowTemplate;
