import { Col, Row, Space, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import RuleLevelIcon from '../RuleList/RuleLevelIcon';
import { AuditResultErrorMessageProps } from './index.type';
import EmptyBox from '../EmptyBox';
import { useRequest } from 'ahooks';
import rule_template from '../../api/rule_template';

import './index.less';

const AuditResultErrorMessage: React.FC<AuditResultErrorMessageProps> = (
  props
) => {
  const filterRuleNames = useMemo(
    () =>
      (props.auditResult?.map((v) => v.rule_name ?? '') ?? []).filter(
        (v) => !!v
      ),
    [props.auditResult]
  );

  const { data: ruleInfo } = useRequest(
    () =>
      rule_template
        .getRuleListV1({
          filter_rule_names: filterRuleNames.join(','),
        })
        .then((res) => res.data.data),
    { ready: !!filterRuleNames.length, refreshDeps: [filterRuleNames] }
  );

  return (
    <EmptyBox if={!!props.auditResult}>
      <Space
        direction="vertical"
        size={5}
        className="audit-result-error-message-wrapper"
      >
        {props.auditResult?.map((v) => {
          return (
            <Row wrap={false} key={v.message}>
              <Col flex="50px">
                <RuleLevelIcon ruleLevel={v.level} />
              </Col>
              <Col flex={1} className="message">
                <Tooltip
                  title={
                    ruleInfo?.find((rule) => rule.rule_name === v.rule_name)
                      ?.annotation ?? ''
                  }
                >
                  {v.message}
                </Tooltip>
              </Col>
            </Row>
          );
        })}
      </Space>
    </EmptyBox>
  );
};

export default AuditResultErrorMessage;
