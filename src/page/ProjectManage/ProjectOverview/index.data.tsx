import { Layout, Layouts } from 'react-grid-layout';
import { ProjectOverviewPanelEnum } from './index.enum';
import { ProjectOverviewPanelGridLayout } from './index.type';
import { TableColumn } from '../../../types/common.type';
import { t } from '../../../locale';
import { TableProps, Typography } from 'antd';
import { IRiskAuditPlan, IRiskWorkflow } from '../../../api/common';
import { Link } from '../../../components/Link';
import { formatTime } from '../../../utils/Common';
import { WorkflowRecordResV2StatusEnum } from '../../../api/common.enum';
import OrderStatusTag from '../../../components/OrderStatusTag';

const elIsStatic = true;
const rowHeight = 280;
const gridLayoutCols = { lg: 5.5, md: 5.5, sm: 2, xs: 2, xxs: 1 };

const firstLineSize = [
  {
    w: 1.6,
    h: 1,
  },
  {
    w: 1.6,
    h: 1,
  },
  {
    w: 2.3,
    h: 1,
  },
];

const secondLineSize = [
  {
    w: 2,
    h: 1.5,
  },
  {
    w: 3.5,
    h: 1.5,
  },
];

const thirdLineSize = [
  {
    w: 2,
    h: 1.5,
  },
  {
    w: 3.5,
    h: 1.5,
  },
];

const fourthLineSize = [
  {
    w: 2,
    h: 1,
  },
  {
    w: 3.5,
    h: 1,
  },
];

const firstLinePanel: ProjectOverviewPanelGridLayout[] = [
  {
    i: ProjectOverviewPanelEnum.ProjectScore,
    w: firstLineSize[0].w,
    h: firstLineSize[0].h,
    static: elIsStatic,
  },
  {
    i: ProjectOverviewPanelEnum.SqlCount,
    w: firstLineSize[1].w,
    h: firstLineSize[1].h,
    static: elIsStatic,
  },
  {
    i: ProjectOverviewPanelEnum.DataSourceCount,
    w: firstLineSize[2].w,
    h: firstLineSize[2].h,
    static: elIsStatic,
  },
];

const secondLinePanel: ProjectOverviewPanelGridLayout[] = [
  {
    i: ProjectOverviewPanelEnum.OrderClassification,
    w: secondLineSize[0].w,
    h: secondLineSize[0].h,
    static: elIsStatic,
  },
  {
    i: ProjectOverviewPanelEnum.OrderRisk,
    w: secondLineSize[1].w,
    h: secondLineSize[1].h,
    static: elIsStatic,
  },
];

const thirdLinePanel: ProjectOverviewPanelGridLayout[] = [
  {
    i: ProjectOverviewPanelEnum.AuditPlanClassification,
    w: thirdLineSize[0].w,
    h: thirdLineSize[0].h,
    static: elIsStatic,
  },
  {
    i: ProjectOverviewPanelEnum.AuditPlanRisk,
    w: thirdLineSize[1].w,
    h: thirdLineSize[1].h,
    static: elIsStatic,
  },
];

const fourthLinePanel: ProjectOverviewPanelGridLayout[] = [
  {
    i: ProjectOverviewPanelEnum.MemberInfo,
    w: fourthLineSize[0].w,
    h: fourthLineSize[0].h,
    static: elIsStatic,
  },
  {
    i: ProjectOverviewPanelEnum.ApprovalProcess,
    w: fourthLineSize[1].w,
    h: fourthLineSize[1].h,
    static: elIsStatic,
  },
];

const genLayoutWithH = (
  panel: ProjectOverviewPanelGridLayout[],
  h: number,
  w?: number
) => {
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

const getMaxH = (sizes: Array<{ w: number; h: number }>) =>
  Math.max(...sizes.map((v) => v.h));

const genLgAndMdLayout: () => Layout[] = () => {
  let ySum = 0;
  const firstLineLayout = genLayoutWithH(firstLinePanel, 0);
  ySum += getMaxH(firstLineSize);

  const secondLineLayout = genLayoutWithH(secondLinePanel, ySum);
  ySum += getMaxH(secondLineSize);

  const thirdLineLayout = genLayoutWithH(thirdLinePanel, ySum);
  ySum += getMaxH(secondLineSize);

  const fourthLineLayout = genLayoutWithH(fourthLinePanel, ySum);
  ySum += getMaxH(secondLineSize);

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
    ...genLayoutWithH(firstLinePanel.slice(0, 2), 0, 1),
    ...genLayoutWithH(firstLinePanel.slice(2), firstLineSize[2].h, 2),
  ];
  ySum = getMaxH(firstLinePanel.slice(0, 2)) + firstLinePanel[2].h;

  const secondLineLayout = [
    ...genLayoutWithH(secondLinePanel.slice(0, 1), ySum, 2),
    ...genLayoutWithH(
      secondLinePanel.slice(1, 2),
      ySum + secondLineSize[0].h,
      2
    ),
  ];
  ySum += secondLineSize[0].h + secondLineSize[1].h;

  const thirdLineLayout = [
    ...genLayoutWithH(thirdLinePanel.slice(0, 1), ySum, 2),
    ...genLayoutWithH(
      thirdLinePanel.slice(1, 2),
      ySum + thirdLinePanel[0].h,
      2
    ),
  ];
  ySum += thirdLineSize[0].h + thirdLineSize[1].h;

  const fourthLineLayout = [
    ...genLayoutWithH(fourthLinePanel.slice(0, 1), ySum, 2),
    ...genLayoutWithH(
      fourthLinePanel.slice(1, 2),
      ySum + fourthLinePanel[0].h,
      2
    ),
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

const tableColumns: {
  order: (projectName: string) => TableColumn<IRiskWorkflow>;
  auditPlan: (projectName: string) => TableColumn<IRiskAuditPlan>;
} = {
  order: (projectName: string) => {
    return [
      {
        dataIndex: 'workflow_name',
        title: t('projectManage.projectOverview.orderRisk.tableColumn.name'),
        render(name: string, record: IRiskWorkflow) {
          return (
            <Link to={`project/${projectName}/order/${record.workflow_id}`}>
              {name}
            </Link>
          );
        },
      },
      {
        dataIndex: 'workflow_status',
        title: t('projectManage.projectOverview.orderRisk.tableColumn.status'),
        render(status: string) {
          if (!Object.keys(WorkflowRecordResV2StatusEnum).includes(status)) {
            return '--';
          }
          return (
            <OrderStatusTag status={status as WorkflowRecordResV2StatusEnum} />
          );
        },
      },
      {
        dataIndex: 'update_time',
        title: t('projectManage.projectOverview.orderRisk.tableColumn.time'),
        render(time: string) {
          return formatTime(time, '--');
        },
      },
      {
        dataIndex: 'create_user_name',
        title: t(
          'projectManage.projectOverview.orderRisk.tableColumn.createUser'
        ),
      },
    ];
  },
  auditPlan: (projectName: string) => {
    return [
      {
        dataIndex: 'audit_plan_report_timestamp',
        title: t(
          'projectManage.projectOverview.auditPlanRisk.tableColumn.name'
        ),
        render(time: string, record: IRiskAuditPlan) {
          const text = `${t('auditPlan.record.generateTime')} ${formatTime(
            time,
            '--'
          )}`;
          return (
            <Link
              data-testid="report-time"
              to={`project/${projectName}/auditPlan/detail/${record.audit_plan_name}/report/${record.audit_plan_report_id}`}
            >
              {text}
            </Link>
          );
        },
      },
      {
        dataIndex: 'audit_plan_name',
        title: t(
          'projectManage.projectOverview.auditPlanRisk.tableColumn.source'
        ),
        width: '20%',
        render(name: string) {
          if (!name) {
            return '--';
          }

          return (
            <Link to={`project/${projectName}/auditPlan/detail/${name}`}>
              {name}
            </Link>
          );
        },
      },
      {
        dataIndex: 'audit_plan_report_timestamp',
        title: t(
          'projectManage.projectOverview.auditPlanRisk.tableColumn.time'
        ),
        render(time: string) {
          return formatTime(time, '--');
        },
      },
      {
        width: '10%',
        dataIndex: 'risk_sql_count',
        title: t(
          'projectManage.projectOverview.auditPlanRisk.tableColumn.count'
        ),
        render(count: number) {
          return <Typography.Text strong>{count}</Typography.Text>;
        },
      },
    ];
  },
};

const tableCommonProps: <T>(
  height: number
) => Pick<TableProps<T>, 'pagination' | 'size' | 'scroll'> = (height) => {
  return {
    size: 'small',
    pagination: false,
    scroll: {
      y: height,
    },
  };
};

export const projectOverviewData = {
  rowHeight,
  gridLayoutCols,
  initialLayouts,
  tableColumns,
  tableCommonProps,
  firstLineSize,
  secondLineSize,
  thirdLineSize,
  fourthLineSize,
};
