import { Result, Typography } from 'antd';
import PanelWrapper from './PanelWrapper';
import { useTranslation } from 'react-i18next';
import CommonGauge from '../Chats/CommonGauge';
import { projectOverviewData } from '../index.data';
import { PanelCommonProps } from '.';
import usePanelCommonRequest from './usePanelCommonRequest';
import statistic from '../../../../api/statistic';
import { useState } from 'react';
import { floatRound } from '../../../../utils/Math';

const { firstLineSize } = projectOverviewData;
const ProjectScore: React.FC<PanelCommonProps> = ({
  projectName,
  ...props
}) => {
  const { t } = useTranslation();
  const [score, setScore] = useState<number>(100);
  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.GetProjectScoreV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setScore(res.data.data?.score ?? 100);
      },
    }
  );
  return (
    <PanelWrapper
      loading={loading}
      error={
        errorMessage ? (
          <Result
            style={{ padding: 0 }}
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={errorMessage}
          />
        ) : null
      }
      title={
        <Typography.Text>
          {t('projectManage.projectOverview.projectScore.title')}
        </Typography.Text>
      }
    >
      <CommonGauge
        h={firstLineSize[0].h}
        percent={floatRound(score / 100)}
        {...props}
      />
    </PanelWrapper>
  );
};

export default ProjectScore;
