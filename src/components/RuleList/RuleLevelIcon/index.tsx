import React from 'react';
import {
  AuditOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Tooltip, Space, Typography } from 'antd';
import { RuleResV1LevelEnum } from '../../../api/common.enum';

const RuleLevelIcon: React.FC<{ ruleLevel?: string }> = (props) => {
  let icon: React.ReactNode;
  const ruleLevel = props.ruleLevel ?? RuleResV1LevelEnum.normal;
  let text = '普通';

  switch (ruleLevel) {
    case RuleResV1LevelEnum.notice:
      icon = <InfoCircleOutlined style={{ fontSize: 25, color: '#3282e6' }} />;
      text = '提示';
      break;
    case RuleResV1LevelEnum.warn:
      icon = <WarningOutlined style={{ fontSize: 25, color: '#ff8c00' }} />;
      text = '告警';
      break;
    case RuleResV1LevelEnum.error:
      icon = <InfoCircleOutlined style={{ fontSize: 25, color: '#f00000' }} />;
      text = '错误';
      break;
    default:
      icon = <AuditOutlined style={{ fontSize: 25 }} />;
  }

  return (
    <Tooltip overlay={`告警等级: ${ruleLevel}(${text})`} placement="topLeft">
      <Space direction="vertical" size={1} className="sqle-rule-icon">
        <div>{icon}</div>
        <Typography.Text type="secondary">{ruleLevel}</Typography.Text>
      </Space>
    </Tooltip>
  );
};

export default RuleLevelIcon;
