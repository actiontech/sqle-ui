import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import useResizeObserver from 'use-resize-observer';
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout';
import { ReportStatisticsPanelEnum } from './index.enum';
import {
  DiffInstanceOrderRejectedPercent,
  DiffUserOrderRejectedPercent,
  LicenseUsage,
  OrderAverageExecuteTime,
  OrderAverageReviewTime,
  OrderQuantityWithDbType,
  InstanceProportionWithDbType,
  OrderPassPercent,
  OrderQuantityTrend,
  OrderStatus,
  OrderTotalNumbers,
} from './Panel';
import reportStatisticsData from './index.data';
import { Theme } from '../../types/theme.type';
import { useTheme } from '@material-ui/styles';
import IconTipsLabel from '../../components/IconTipsLabel';

import './index.less';
import 'react-grid-layout/css/styles.css';

const { initialLayouts, gridLayoutCols, rowHeight } = reportStatisticsData;
const ReportStatistics: React.FC = () => {
  const { t } = useTranslation();
  const { ref, width = 0 } = useResizeObserver();
  const theme = useTheme<Theme>();
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
        ghost={false}
      />
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
          <div key={ReportStatisticsPanelEnum.OrderAverageExecuteTime}>
            <OrderAverageExecuteTime />
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
          <div key={ReportStatisticsPanelEnum.DiffInstanceOrderRejectedPercent}>
            <DiffInstanceOrderRejectedPercent />
          </div>
        </ResponsiveReactGridLayout>
      </section>
    </>
  );
};

export default ReportStatistics;
