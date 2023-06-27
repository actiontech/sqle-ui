import { useTheme } from '@mui/styles';
import { Anchor, Button, Col, Divider, Row, Space, Steps } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseInfoForm from './BaseInfoForm';
import { RuleTemplateFormProps } from './index.type';
import RuleSelect from './RuleSelect';
import { Theme } from '@mui/material/styles';
import FooterButtonWrapper from '../../../components/FooterButtonWrapper';

const RuleTemplateForm: React.FC<RuleTemplateFormProps> = (props) => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

  const stepItems = [
    {
      title: t('ruleTemplate.ruleTemplateForm.baseInfoTitle'),
      description: t('ruleTemplate.ruleTemplateForm.baseInfoDesc'),
    },
    {
      title: t('ruleTemplate.ruleTemplateForm.ruleTitle'),
      description: t('ruleTemplate.ruleTemplateForm.ruleDesc'),
    },
    {
      title: t('ruleTemplate.ruleTemplateForm.result'),
      description: t('ruleTemplate.ruleTemplateForm.resultDesc'),
    },
  ];

  return (
    <>
      <Space
        size={theme.common.padding}
        direction="vertical"
        className="full-width-element"
      >
        <Row>
          <Col span={12} offset={6}>
            <Steps current={props.step} items={stepItems}></Steps>
          </Col>
        </Row>
        <div hidden={props.step !== 0} data-testid="base-form">
          <BaseInfoForm
            form={props.form}
            submit={props.baseInfoSubmit}
            defaultData={props.defaultData}
            projectName={props.projectName}
            mode={props.mode}
          />
        </div>
        <div hidden={props.step !== 1} data-testid="rule-list">
          <Space align="start" size={30}>
            <Anchor
              className="custom-anchor"
              targetOffset={240}
              onClick={(e) => e.preventDefault()}
              getCurrentAnchor={(v) => {
                return v || '#activeRuleTitle';
              }}
            >
              <Anchor.Link
                href="#activeRuleTitle"
                title={t('ruleTemplate.ruleTemplateForm.activeAnchorTitle')}
              ></Anchor.Link>
              <Anchor.Link
                href="#disableRuleTitle"
                title={t('ruleTemplate.ruleTemplateForm.disableAnchorTitle')}
              ></Anchor.Link>
            </Anchor>
            <RuleSelect
              allRules={props.allRules}
              listLoading={props.ruleListLoading}
              activeRule={props.activeRule}
              updateActiveRule={props.updateActiveRule}
            />
          </Space>

          <Divider dashed />
          <FooterButtonWrapper>
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
          </FooterButtonWrapper>
        </div>
        <div hidden={props.step !== 2} data-testid="submit-result">
          {props.children}
        </div>
      </Space>
    </>
  );
};

export default RuleTemplateForm;
