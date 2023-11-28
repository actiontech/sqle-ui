import { AuditResultColumnProps } from './index.type';
import AuditResultErrorMessage from '../../../../components/AuditResultErrorMessage';
import { RuleResV1LevelEnum } from '../../../../api/common.enum';
import './index.less';
import RuleLevelIcon from '../../../../components/RuleList/RuleLevelIcon';
import useStyles from '../../../../theme';
import { useTranslation } from 'react-i18next';

const AuditResultInfo: React.FC<AuditResultColumnProps> = ({
  auditResult = [],
  auditStatus,
}) => {
  const auditResultNum = auditResult?.length ?? 0;
  const styles = useStyles();
  const { t } = useTranslation();

  const renderResultBox = (
    ruleLevel: RuleResV1LevelEnum | 'passed',
    resultNum?: number
  ) => {
    return (
      <div
        className={`result-box ${
          ruleLevel === RuleResV1LevelEnum.normal
            ? `${styles.auditResultLevelNormalBox}`
            : `result-box-${ruleLevel}`
        }`}
      >
        <RuleLevelIcon
          ruleLevel={ruleLevel}
          iconFontSize={14}
          onlyShowIcon={true}
        />
        <span className="result-box-level">{ruleLevel}</span>
        {/* 修复passed情况下的宽度问题，提供空格占位 */}
        {resultNum ? <span>{resultNum}</span> : <span>&nbsp;&nbsp;</span>}
      </div>
    );
  };

  const getResultNum = (ruleLevel: RuleResV1LevelEnum) =>
    auditResult.filter((item) => item.level === ruleLevel).length;

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
          const level = key as RuleResV1LevelEnum;
          const innerResultNum = getResultNum(level);
          return (
            !!innerResultNum && (
              <li key={level}>{renderResultBox(level, innerResultNum)}</li>
            )
          );
        })}
      </div>
    );
  };
  const renderAuditColumn = () => {
    if (!!auditStatus && auditStatus !== 'finished') {
      return (
        <AuditResultErrorMessage
          auditResult={[
            {
              level: RuleResV1LevelEnum.normal,
              message: t('sqlAudit.list.auditing'),
            },
          ]}
        />
      );
    }
    if (auditResultNum === 1)
      return <AuditResultErrorMessage auditResult={auditResult} />;

    if (auditResultNum === 0)
      return <div className="flex-space-between" >{renderResultBox('passed')}</div>;

    return renderResultBoxList();
  };

  return <>{renderAuditColumn()}</>;
};

export default AuditResultInfo;
