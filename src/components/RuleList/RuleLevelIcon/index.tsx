import React from 'react';
import {
  AuditOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Tooltip, Space, Typography } from 'antd';
import { RuleResV1LevelEnum } from '../../../api/common.enum';

import './index.less';
import { t } from 'i18next';

const RuleLevelIcon: React.FC<{
  ruleLevel?: string;
  iconFontSize?: number;
  onlyShowIcon?: boolean;
}> = ({
  ruleLevel = RuleResV1LevelEnum.normal,
  iconFontSize = 25,
  onlyShowIcon = false,
}) => {
  let icon: React.ReactNode;
  let text = t('rule.ruleLevelIcon.normal');

  switch (ruleLevel) {
    case RuleResV1LevelEnum.notice:
      icon = (
        <InfoCircleOutlined
          style={{ fontSize: iconFontSize, color: '#3282e6' }}
        />
      );
      text = t('rule.ruleLevelIcon.notice');
      break;
    case RuleResV1LevelEnum.warn:
      icon = (
        <WarningOutlined style={{ fontSize: iconFontSize, color: '#ff8c00' }} />
      );
      text = t('rule.ruleLevelIcon.warn');
      break;
    case RuleResV1LevelEnum.error:
      icon = (
        <InfoCircleOutlined
          style={{ fontSize: iconFontSize, color: '#f00000' }}
        />
      );
      text = t('rule.ruleLevelIcon.error');
      break;
    default:
      icon = <AuditOutlined style={{ fontSize: iconFontSize }} />;
  }

  return onlyShowIcon ? (
    icon
  ) : (
    <Tooltip
      overlay={t<string>('rule.ruleLevelIcon.toolTipsTitle', {
        ruleLevel,
        text,
      })}
      placement="topLeft"
    >
      <Space
        direction="vertical"
        size={1}
        className="sqle-rule-icon"
        align="center"
      >
        <div>{icon}</div>
        <Typography.Text type="secondary">{ruleLevel}</Typography.Text>
      </Space>
    </Tooltip>
  );
};

export default RuleLevelIcon;
