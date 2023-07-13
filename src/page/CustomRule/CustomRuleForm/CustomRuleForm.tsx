import { useTheme } from '@mui/styles';
import { Col, Row, Space, Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { CustomRuleFormProps } from '.';
import BaseInfoForm from './BaseInfoForm';
import EditRuleScript from './EditRuleScript';

const CustomRuleForm: React.FC<CustomRuleFormProps> = (props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const stepItems = [
    {
      title: t('customRule.customRuleForm.baseInfoTitle'),
      description: t('customRule.customRuleForm.baseInfoDesc'),
    },
    {
      title: t('customRule.customRuleForm.editRuleTitle'),
      description: t('customRule.customRuleForm.editRuleDesc'),
    },
    {
      title: t('customRule.customRuleForm.submit'),
      description: t('customRule.customRuleForm.submitCustomRule'),
    },
  ];

  return (
    <Space
      size={theme.common.padding}
      direction="vertical"
      className="full-width-element"
    >
      <Row>
        <Col span={12} offset={6}>
          <Steps current={props.step} items={stepItems} />
        </Col>
      </Row>
      <div hidden={props.step !== 0} data-testid="base-form">
        <BaseInfoForm
          form={props.form}
          submit={props.baseInfoSubmit}
          defaultData={props.defaultData}
        />
      </div>

      <div hidden={props.step !== 1} data-testid="rule-script">
        <EditRuleScript
          form={props.editScriptForm}
          prevStep={props.prevStep}
          submit={props.submit}
          submitLoading={props.submitLoading}
          defaultData={props.defaultData}
        />
      </div>

      <div hidden={props.step !== 2} data-testid="submit-result">
        {props.children}
      </div>
    </Space>
  );
};
export default CustomRuleForm;
