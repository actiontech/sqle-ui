import { Button, Col, Divider, Row, Space, Steps } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseInfoForm from './BaseInfoForm';
import { RuleTemplateFormProps } from './index.type';
import RuleSelect from './RuleSelect';

const RuleTemplateForm: React.FC<RuleTemplateFormProps> = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <Space size={24} direction="vertical" className="full-width-element">
        <Row>
          <Col span={12} offset={6}>
            <Steps current={props.step}>
              <Steps.Step
                title={t('ruleTemplate.ruleTemplateForm.baseInfoTitle')}
                description={t('ruleTemplate.ruleTemplateForm.baseInfoDesc')}
              />
              <Steps.Step
                title={t('ruleTemplate.ruleTemplateForm.ruleTitle')}
                description={t('ruleTemplate.ruleTemplateForm.ruleDesc')}
              />
              <Steps.Step
                title={t('ruleTemplate.ruleTemplateForm.result')}
                description={t('ruleTemplate.ruleTemplateForm.resultDesc')}
              />
            </Steps>
          </Col>
        </Row>
        <div hidden={props.step !== 0}>
          <BaseInfoForm
            isUpdate={props.isUpdate}
            form={props.form}
            submit={props.baseInfoSubmit}
          />
        </div>
        <div hidden={props.step !== 1}>
          <RuleSelect
            allRules={props.allRules}
            listLoading={props.ruleListLoading}
            activeRule={props.activeRule}
            updateActiveRule={props.updateActiveRule}
          />
          <Divider dashed />
          <Row justify="end">
            <Space>
              <Button disabled={props.submitLoading} onClick={props.prevStep}>
                {t('common.prevStep')}
              </Button>
              <Button
                loading={props.submitLoading}
                onClick={props.submit}
                type="primary"
              >
                {t('common.submit')}
              </Button>
            </Space>
          </Row>
        </div>
        <div hidden={props.step !== 2}>{props.children}</div>
      </Space>
    </>
  );
};

export default RuleTemplateForm;
