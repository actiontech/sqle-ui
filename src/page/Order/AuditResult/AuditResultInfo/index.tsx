import { AuditResultColumnProps } from './index.type';
import AuditResultErrorMessage from '../../../../components/AuditResultErrorMessage';
import { RuleResV1LevelEnum } from '../../../../api/common.enum';
import './index.less';
import RuleLevelIcon from '../../../../components/RuleList/RuleLevelIcon';
import useStyles from '../../../../theme';

const AuditResultInfo: React.FC<AuditResultColumnProps> = ({
  auditResult = [],
}) => {
  const auditResultNum = auditResult?.length ?? 0;
  const styles = useStyles();

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
        {resultNum && <span>{resultNum}</span>}
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
    if (auditResultNum === 1)
      return <AuditResultErrorMessage auditResult={auditResult} />;

    if (auditResultNum === 0) return renderResultBox('passed');

    return renderResultBoxList();
  };

  return <>{renderAuditColumn()}</>;
};

export default AuditResultInfo;
