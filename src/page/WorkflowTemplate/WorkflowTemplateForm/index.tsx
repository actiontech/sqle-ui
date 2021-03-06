import { useTheme } from '@material-ui/styles';
import { useBoolean } from 'ahooks';
import { Col, Row, Space, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWorkFlowStepTemplateReqV1 } from '../../../api/common';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { Theme } from '../../../types/theme.type';
import EventEmitter from '../../../utils/EventEmitter';
import BaseForm from './BaseForm';
import { WorkflowTemplateFormProps } from './index.type';
import ProgressConfig from './ProgressConfig';

const WorkflowTemplateForm: React.FC<WorkflowTemplateFormProps> = (props) => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean(false);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitProgress = (progressConfig: IWorkFlowStepTemplateReqV1[]) => {
    startSubmit();
    props
      .submitProgress(progressConfig)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          nextStep();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  useEffect(() => {
    const resetAllForm = () => {
      setStep(0);
    };
    EventEmitter.subscribe(
      EmitterKey.Reset_Workflow_Template_Form,
      resetAllForm
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Workflow_Template_Form,
        resetAllForm
      );
    };
  }, []);

  return (
    <Space
      size={theme.common.padding}
      direction="vertical"
      className="full-width-element"
    >
      <Row>
        <Col span={12} offset={6}>
          <Steps current={step}>
            <Steps.Step
              title={t('workflowTemplate.step.baseFormTitle')}
              description={t('workflowTemplate.step.baseFormDesc')}
            />
            <Steps.Step
              title={t('workflowTemplate.step.progressTitle')}
              description={t('workflowTemplate.step.progressDesc')}
            />
            <Steps.Step
              title={t('workflowTemplate.step.resultTitle')}
              description={t('workflowTemplate.step.resultDesc')}
            />
          </Steps>
        </Col>
      </Row>
      <div hidden={step !== 0} data-testid="base-form">
        <BaseForm
          defaultData={props.defaultData}
          nextStep={nextStep}
          updateBaseInfo={props.updateBaseInfo}
        />
      </div>
      <div hidden={step !== 1} data-testid="progress-config">
        <ProgressConfig
          defaultData={props.defaultData}
          submitLoading={submitLoading}
          prevStep={prevStep}
          submitProgressConfig={submitProgress}
        />
      </div>
      <div hidden={step !== 2} data-testid="submit-result">
        {props.children}
      </div>
    </Space>
  );
};

export default WorkflowTemplateForm;
