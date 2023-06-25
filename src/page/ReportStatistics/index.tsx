import { Button, Image, PageHeader, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import useResizeObserver from 'use-resize-observer';
import { ResponsiveProps, Responsive } from 'react-grid-layout';
import { ReportStatisticsPanelEnum } from './index.enum';
import {
  DiffUserOrderRejectedPercent,
  LicenseUsage,
  OrderAverageReviewTime,
  OrderQuantityWithDbType,
  InstanceProportionWithDbType,
  OrderPassPercent,
  OrderQuantityTrend,
  OrderStatus,
  OrderTotalNumbers,
  SqlExecFailedTopN,
  OrderAverageExecuteTimeTopN,
} from './Panel';
import reportStatisticsData from './index.data';
import { useTheme } from '@mui/styles';
import IconTipsLabel from '../../components/IconTipsLabel';
import { SyncOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { refreshReportStatistics } from '../../store/reportStatistics';
import { ComponentType } from 'react';

import './index.less';
import 'react-grid-layout/css/styles.css';
import { Theme } from '@mui/material/styles';
import EnterpriseFeatureDisplay from '../../components/EnterpriseFeatureDisplay/EnterpriseFeatureDisplay';

const ResponsiveReactGridLayout = Responsive as ComponentType<ResponsiveProps>;
const { initialLayouts, gridLayoutCols, rowHeight } = reportStatisticsData;
const ReportStatistics: React.FC = () => {
  const { t } = useTranslation();
  const { ref, width = 0 } = useResizeObserver();
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();

  const refreshPanelData = () => {
    dispatch(refreshReportStatistics());
  };
  return (
    <>
      <PageHeader
        title={
          <>
            {t('reportStatistics.title')}
            <IconTipsLabel
              tips={t('reportStatistics.titleTips')}
              iconStyle={{ fontSize: 14, marginLeft: 6 }}
            />
          </>
        }
        /* IFTRUE_isEE */
        extra={
          <Button
            onClick={refreshPanelData}
            data-testid="refreshReportStatistics"
          >
            <SyncOutlined />
          </Button>
        }
        /* FITRUE_isEE */
        ghost={false}
      >
        {t('reportStatistics.pageDesc')}
      </PageHeader>

      <EnterpriseFeatureDisplay
        featureName={t('reportStatistics.title')}
        eeFeatureDescription={
          <Space direction="vertical">
            <Typography.Text>{t('reportStatistics.ceTips')}</Typography.Text>
            <Image
              width="50%"
              alt="reportStatisticsPreview"
              src="/static/image/report_statistics_preview.png"
            />
          </Space>
        }
      >
        <section ref={ref} className="page-report-statistics-namespace">
          <ResponsiveReactGridLayout
            width={width}
            layouts={initialLayouts}
            cols={gridLayoutCols}
            rowHeight={rowHeight}
            margin={[theme.common.padding, theme.common.padding]}
            containerPadding={[theme.common.padding, theme.common.padding]}
          >
            <div key={ReportStatisticsPanelEnum.OrderTotalNumbers}>
              <OrderTotalNumbers />
            </div>
            <div key={ReportStatisticsPanelEnum.OrderAverageReviewTime}>
              <OrderAverageReviewTime />
            </div>
            <div key={ReportStatisticsPanelEnum.OrderPassPercent}>
              <OrderPassPercent />
            </div>
            <div key={ReportStatisticsPanelEnum.OrderQuantityTrend}>
              <OrderQuantityTrend />
            </div>
            <div key={ReportStatisticsPanelEnum.OrderStatus}>
              <OrderStatus />
            </div>
            <div key={ReportStatisticsPanelEnum.OrderQuantityWithDbType}>
              <OrderQuantityWithDbType />
            </div>
            <div key={ReportStatisticsPanelEnum.InstanceProportionWithDbType}>
              <InstanceProportionWithDbType />
            </div>
            <div key={ReportStatisticsPanelEnum.LicenseUsage}>
              <LicenseUsage />
            </div>
            <div key={ReportStatisticsPanelEnum.DiffUserOrderRejectedPercent}>
              <DiffUserOrderRejectedPercent />
            </div>
            <div key={ReportStatisticsPanelEnum.orderAverageExecuteTimeTopN}>
              <OrderAverageExecuteTimeTopN />
            </div>
            <div key={ReportStatisticsPanelEnum.sqlExecFailedTopN}>
              <SqlExecFailedTopN />
            </div>
          </ResponsiveReactGridLayout>
        </section>
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default ReportStatistics;
