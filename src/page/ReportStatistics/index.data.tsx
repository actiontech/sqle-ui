import { TableProps, Typography } from 'antd';
import { Layout, Layouts } from 'react-grid-layout';
import {
  IWorkflowRejectedPercentGroupByInstance,
  IWorkflowRejectedPercentGroupByCreator,
} from '../../api/common';
import i18n from '../../locale';
import { TableColumn } from '../../types/common.type';
import { floatRound } from '../../utils/Math';
import { ReportStatisticsPanelEnum } from './index.enum';
import { IPanelGridLayout } from './index.type';

const firstLineSize = {
  w: 1,
  h: 1,
};
const secondLineSize = [
  {
    w: 2.5,
    h: 2.5,
  },
  {
    w: 1.5,
    h: 2.5,
  },
];
const thirdLineSize = {
  w: 4 / 3,
  h: 2,
};
const fourthLineSize = {
  w: 2,
  h: 4,
};
const elIsStatic = true;
const secondLineMaxH = Math.max(...secondLineSize.map((v) => v.h));

const firstLinePanel: IPanelGridLayout[] = [
  {
    i: ReportStatisticsPanelEnum.OrderTotalNumbers,
    w: firstLineSize.w,
    h: firstLineSize.h,
    static: elIsStatic,
  },
  {
    i: ReportStatisticsPanelEnum.OrderAverageReviewTime,
    w: firstLineSize.w,
    h: firstLineSize.h,
    static: elIsStatic,
  },
  {
    i: ReportStatisticsPanelEnum.OrderAverageExecuteTime,
    w: firstLineSize.w,
    h: firstLineSize.h,
    static: elIsStatic,
  },
  {
    i: ReportStatisticsPanelEnum.OrderPassPercent,
    w: firstLineSize.w,
    h: firstLineSize.h,
    static: elIsStatic,
  },
];

const secondLinePanel: IPanelGridLayout[] = [
  {
    i: ReportStatisticsPanelEnum.OrderQuantityTrend,
    w: secondLineSize[0].w,
    h: secondLineSize[0].h,
    static: elIsStatic,
  },
  {
    i: ReportStatisticsPanelEnum.OrderStatus,
    w: secondLineSize[1].w,
    h: secondLineSize[1].h,
    static: elIsStatic,
  },
];

const thirdLinePanel: IPanelGridLayout[] = [
  {
    i: ReportStatisticsPanelEnum.OrderQuantityWithDbType,
    w: thirdLineSize.w,
    h: thirdLineSize.h,
    static: elIsStatic,
  },
  {
    i: ReportStatisticsPanelEnum.InstanceProportionWithDbType,
    w: thirdLineSize.w,
    h: thirdLineSize.h,
    static: elIsStatic,
  },
  {
    i: ReportStatisticsPanelEnum.LicenseUsage,
    w: thirdLineSize.w,
    h: thirdLineSize.h,
    static: elIsStatic,
  },
];

const fourthLinePanel: IPanelGridLayout[] = [
  {
    i: ReportStatisticsPanelEnum.DiffUserOrderRejectedPercent,
    w: fourthLineSize.w,
    h: fourthLineSize.h,
    static: elIsStatic,
  },
  {
    i: ReportStatisticsPanelEnum.DiffInstanceOrderRejectedPercent,
    w: fourthLineSize.w,
    h: fourthLineSize.h,
    static: elIsStatic,
  },
];

const genLayoutWithH = (panel: IPanelGridLayout[], h: number, w?: number) => {
  let xSum = 0;
  return panel.map((v) => {
    const res = w
      ? {
          ...v,
          x: xSum,
          y: h,
          w: w,
        }
      : {
          ...v,
          x: xSum,
          y: h,
        };
    xSum += v.w;
    return res;
  });
};

const genLgAndMdLayout: () => Layout[] = () => {
  let ySum = 0;
  const firstLineLayout = genLayoutWithH(firstLinePanel, 0);
  ySum += firstLineSize.h;

  const secondLineLayout = genLayoutWithH(secondLinePanel, ySum);
  ySum += secondLineMaxH;

  const thirdLineLayout = genLayoutWithH(thirdLinePanel, ySum);
  ySum += thirdLineSize.h;

  const fourthLineLayout = genLayoutWithH(fourthLinePanel, ySum);
  return [
    ...firstLineLayout,
    ...secondLineLayout,
    ...thirdLineLayout,
    ...fourthLineLayout,
  ];
};

const genSmAndXsLayout: () => Layout[] = () => {
  let ySum = 0;
  const firstLineLayout = [
    ...genLayoutWithH(firstLinePanel.slice(0, 2), 0),
    ...genLayoutWithH(firstLinePanel.slice(2, 4), firstLineSize.h),
  ];
  ySum = firstLineSize.h * 2;

  const secondLineLayout = [
    ...genLayoutWithH(secondLinePanel.slice(0, 1), ySum, 4),
    ...genLayoutWithH(
      secondLinePanel.slice(1, 2),
      ySum + secondLineSize[0].h,
      4
    ),
  ];
  ySum += secondLineSize[0].h + secondLineSize[1].h;

  const thirdLineLayout = [
    ...genLayoutWithH(thirdLinePanel.slice(0, 1), ySum, 4),
    ...genLayoutWithH(thirdLinePanel.slice(1, 2), ySum + thirdLineSize.h, 4),
    ...genLayoutWithH(
      thirdLinePanel.slice(2, 3),
      ySum + thirdLineSize.h * 2,
      4
    ),
  ];
  ySum += thirdLineSize.h * 3;

  const fourthLineLayout = [
    ...genLayoutWithH(fourthLinePanel.slice(0, 1), ySum, 4),
    ...genLayoutWithH(fourthLinePanel.slice(1, 2), ySum + fourthLineSize.h, 4),
  ];

  return [
    ...firstLineLayout,
    ...secondLineLayout,
    ...thirdLineLayout,
    ...fourthLineLayout,
  ];
};

const genXxsLayout: () => Layout[] = () => {
  let ySum = 0;
  return [
    ...firstLinePanel,
    ...secondLinePanel,
    ...thirdLinePanel,
    ...fourthLinePanel,
  ].map((v) => {
    const res = {
      ...v,
      x: 0,
      y: ySum,
      w: 4,
    };
    ySum += v.h;
    return res;
  });
};

const initialLayouts: Layouts = {
  lg: genLgAndMdLayout(),
  md: genLgAndMdLayout(),
  sm: genSmAndXsLayout(),
  xs: genSmAndXsLayout(),
  xxs: genXxsLayout(),
};

const gridLayoutCols = { lg: 4, md: 4, sm: 2, xs: 2, xxs: 1 };
const rowHeight = 120;

const tableLimit = 10;
const tableColumns: {
  user: () => TableColumn<IWorkflowRejectedPercentGroupByCreator>;
  instance: () => TableColumn<IWorkflowRejectedPercentGroupByInstance>;
} = {
  user: () => {
    return [
      {
        dataIndex: 'creator',
        title: i18n.t(
          'reportStatistics.diffUserOrderRejectRate.columns.username'
        ),
      },
      {
        dataIndex: 'workflow_total_num',
        title: i18n.t(
          'reportStatistics.diffUserOrderRejectRate.columns.totalOrder'
        ),
      },
      {
        dataIndex: 'rejected_percent',
        title: i18n.t(
          'reportStatistics.diffUserOrderRejectRate.columns.rejectRate'
        ),
        render(v) {
          if (!v) {
            return '';
          }
          return (
            <Typography.Text className="text-blue">{`${floatRound(
              v
            )}%`}</Typography.Text>
          );
        },
      },
    ];
  },
  instance: () => {
    return [
      {
        dataIndex: 'instance_name',
        title: i18n.t(
          'reportStatistics.diffInstanceOrderRejectRate.columns.instanceName'
        ),
      },
      {
        dataIndex: 'workflow_total_num',
        title: i18n.t(
          'reportStatistics.diffInstanceOrderRejectRate.columns.totalOrder'
        ),
      },
      {
        dataIndex: 'rejected_percent',
        title: i18n.t(
          'reportStatistics.diffInstanceOrderRejectRate.columns.rejectRate'
        ),
        render(v) {
          return (
            <Typography.Text className="text-blue">{`${floatRound(
              v
            )}%`}</Typography.Text>
          );
        },
      },
    ];
  },
};

const tableCommonProps: <T>() => Pick<
  TableProps<T>,
  'pagination' | 'size'
> = () => {
  return { size: 'small', pagination: false };
};

const reportStatisticsData = {
  initialLayouts,
  gridLayoutCols,
  rowHeight,
  secondLineSize,
  thirdLineSize,
  fourthLineSize,
  tableLimit,
  tableColumns,
  tableCommonProps,
};

export default reportStatisticsData;
