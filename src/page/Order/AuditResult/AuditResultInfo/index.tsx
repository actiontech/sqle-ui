import { useMemo } from 'react';
import { AuditResultColumnProps } from './index.type';
import AuditResultErrorMessage from '../../../../components/AuditResultErrorMessage';
import {
  InfoCircleOutlined,
  CheckOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { RuleResV1LevelEnum } from '../../../../api/common.enum';
import './index.less';

const AuditResultInfo: React.FC<AuditResultColumnProps> = (props) => {
  const auditResult = useMemo(
    () => props?.auditResult ?? [],
    [props.auditResult]
  );
  const auditResultNum = auditResult.length;

  const getClassNameAndIconByStatus = (status: string) => {
    const defaultClassName = 'result-box';
    const defaultIcon = <InfoCircleOutlined />;

    switch (status) {
      case 'passed':
        return {
          className: `${defaultClassName}-success`,
          icon: <CheckOutlined />,
        };
      case RuleResV1LevelEnum.normal:
      case RuleResV1LevelEnum.warn:
        return {
          className: `${defaultClassName}-warning`,
          icon: <WarningOutlined />,
        };
      case RuleResV1LevelEnum.error:
        return {
          className: `${defaultClassName}-error`,
          icon: <InfoCircleOutlined />,
        };
      default:
        return {
          className: '',
          icon: defaultIcon,
        };
    }
  };

  const renderResultBox = (resultLevel: string, resultNum?: number) => {
    const { className, icon } = getClassNameAndIconByStatus(resultLevel);

    return (
      <div className={`result-box ${className}`}>
        {icon}
        <span className="result-box-level">{resultLevel}</span>
        {resultNum && <span>{resultNum}</span>}
      </div>
    );
  };

  const getResultNum = (status: string) =>
    auditResult.filter((item) => item.level === status).length;

  const renderResultBoxList = () => {
    const renderLevelKey = [
      RuleResV1LevelEnum.error,
      RuleResV1LevelEnum.warn,
      RuleResV1LevelEnum.normal,
      RuleResV1LevelEnum.notice,
    ];

    return (
      <div className="result-box-list">
        {renderLevelKey.map((key) => {
          const innerResultNum = getResultNum(key);
          return (
            !!innerResultNum && (
              <li key={key}>{renderResultBox(key, innerResultNum)}</li>
            )
          );
        })}
      </div>
    );
  };

  const renderAuditColumn = () => {
    if (auditResultNum === 1)
      return <AuditResultErrorMessage auditResult={auditResult} />;

    if (auditResultNum === 0) return renderResultBox('passed');

    return renderResultBoxList();
  };

  return <>{renderAuditColumn()}</>;
};

export default AuditResultInfo;
