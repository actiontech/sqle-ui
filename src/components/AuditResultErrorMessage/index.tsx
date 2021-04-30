import { Col, Row, Space } from 'antd';
import React from 'react';
import RuleLevelIcon from '../RuleList/RuleLevelIcon';
import { AuditResultErrorMessageProps } from './index.type';
import './index.less';
import EmptyBox from '../EmptyBox';

const AuditResultErrorMessage: React.FC<AuditResultErrorMessageProps> = (
  props
) => {
  const errorMessageList = React.useMemo(() => {
    if (props.resultErrorMessage === undefined) {
      return [];
    }
    const errors = props.resultErrorMessage.split('\n');
    const errorMessageList: {
      level: string;
      message: string;
    }[] = [];

    errors.forEach((error) => {
      if (!error.trim().startsWith('[')) {
        errorMessageList.push({
          level: 'normal',
          message: error.trim(),
        });
      } else {
        const levelRegResult = error.match(/^\[(.+)\]/);
        let level = 'normal';
        if (levelRegResult != null) {
          level = levelRegResult[1];
        }
        const message = error.slice(level.length + 2).trim();
        errorMessageList.push({
          level,
          message,
        });
      }
    });
    return errorMessageList;
  }, [props.resultErrorMessage]);

  return (
    <EmptyBox if={!!props.resultErrorMessage}>
      <Space
        direction="vertical"
        size={5}
        className="audit-result-error-message-wrapper"
      >
        {errorMessageList.map((err) => {
          return (
            <Row wrap={false} key={err.message}>
              <Col flex="50px">
                <RuleLevelIcon ruleLevel={err.level} />
              </Col>
              <Col flex={1} className="message">
                {err.message}
              </Col>
            </Row>
          );
        })}
      </Space>
    </EmptyBox>
  );
};

export default AuditResultErrorMessage;
