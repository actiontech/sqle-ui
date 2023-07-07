import { Result, Typography } from 'antd';
import PanelWrapper from './PanelWrapper';
import { useTranslation } from 'react-i18next';
import { projectOverviewData } from '../index.data';
import { RadialBar, RadialBarConfig } from '@ant-design/plots';
import { t } from '../../../../locale';
import { useMemo, useState } from 'react';
import { PanelCommonProps } from '.';
import usePanelCommonRequest from './usePanelCommonRequest';
import statistic from '../../../../api/statistic';

const typeMap = {
  risk: t('projectManage.projectOverview.sqlCount.riskSQL'),
  sqlCount: t('projectManage.projectOverview.sqlCount.SQLCount'),
};

const colors = ['#fbd44d', '#42a2ff'];

const config: RadialBarConfig = {
  data: [],
  xField: 'type',
  yField: 'value',
  colorField: 'type',
  xAxis: false,
  yAxis: false,
  color: colors,
  legend: {
    position: 'right',
    layout: 'vertical',
    animate: true,
  },

  maxAngle: 360,
  radius: 1,
  innerRadius: 0.8,
};

const { firstLineSize, rowHeight } = projectOverviewData;

const SqlCount: React.FC<PanelCommonProps> = ({
  commonPadding,
  currentTheme,
  language,
  projectName,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<RadialBarConfig['data']>([
    {
      type: '',
      value: 0,
    },
  ]);
  const [riskRate, setRiskRate] = useState<string>('');
  const { loading, errorMessage } = usePanelCommonRequest(
    () =>
      statistic.statisticsAuditedSQLV1({
        project_name: projectName,
      }),
    {
      onSuccess: (res) => {
        setRiskRate(
          typeof res.data.risk_rate === 'number' ? `${res.data.risk_rate}%` : ''
        );

        setData([
          {
            type: typeMap.risk,
            value: res.data.data?.risk_sql_count ?? 0,
          },
          {
            type: typeMap.sqlCount,
            value: res.data.data?.total_sql_count ?? 0,
          },
        ]);
      },
    }
  );

  const annotations = useMemo<RadialBarConfig['annotations']>(() => {
    return [
      {
        type: 'html',
        position: ['50%', '50%'],
        html: () => {
          return `<div style="transform:translate(-50%,-46%)">
          <div style="text-align:center;font-size:24px;font-weight:bold;color:${
            colors[0]
          }">${
            riskRate ? t('projectManage.projectOverview.sqlCount.riskRate') : ''
          }</div>
          <div style="text-align:center;font-size:24px; font-weight:bold; color:${
            colors[0]
          }"> ${riskRate}</div>
        </div>`;
        },
      },
    ];
  }, [riskRate, t]);

  const height = useMemo(() => {
    return (
      rowHeight * firstLineSize[1].h +
      commonPadding * (firstLineSize[1].h - 1) -
      80
    );
  }, [commonPadding]);
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
          {t('projectManage.projectOverview.sqlCount.title')}
        </Typography.Text>
      }
    >
      <RadialBar
        {...config}
        data={data}
        annotations={annotations}
        theme={currentTheme}
        locale={language}
        height={height}
      />
    </PanelWrapper>
  );
};

export default SqlCount;
