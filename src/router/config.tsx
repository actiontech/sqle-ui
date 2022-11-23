import React from 'react';
import { RouteProps } from 'react-router-dom';
import {
  GlobalRouterItemKeyLiteral,
  ProjectDetailRouterItemKeyLiteral,
  RouterItem,
} from '../types/router.type';
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  DatabaseOutlined,
  AuditOutlined,
  ConsoleSqlOutlined,
  BarsOutlined,
  ProfileOutlined,
  SettingOutlined,
  NodeIndexOutlined,
  CiCircleOutlined,
  SearchOutlined,
  BarChartOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { SystemRole } from '../data/common';

const Home = React.lazy(
  () => import(/* webpackChunkName: "Home" */ '../page/Home')
);

const Login = React.lazy(
  () => import(/* webpackChunkName: "Login" */ '../page/Login')
);

const User = React.lazy(
  () => import(/* webpackChunkName: "User" */ '../page/UserCenter/User')
);

const Role = React.lazy(
  () => import(/* webpackChunkName: "Role" */ '../page/UserCenter/Role')
);

const UserGroup = React.lazy(
  () =>
    import(/* webpackChunkName: "UserGroup" */ '../page/UserCenter/UserGroup')
);

const Rule = React.lazy(
  () => import(/* webpackChunkName: "Rule" */ '../page/Rule')
);

const DataSource = React.lazy(
  () => import(/* webpackChunkName: "DataSource" */ '../page/DataSource')
);

const RuleTemplate = React.lazy(
  () => import(/* webpackChunkName: "RuleTemplate" */ '../page/RuleTemplate')
);

const GlobalRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "GlobalRuleTemplate" */ '../page/GlobalRuleTemplate'
    )
);

const Account = React.lazy(
  () => import(/* webpackChunkName: "Account" */ '../page/Account')
);

const CreateOrder = React.lazy(
  () => import(/* webpackChunkName: "CreateOrder" */ '../page/Order/Create')
);

const OrderDetail = React.lazy(
  () => import(/* webpackChunkName: "OrderDetail" */ '../page/Order/Detail')
);

const OrderList = React.lazy(
  () => import(/* webpackChunkName: "Order" */ '../page/Order/List')
);
/* IFTRUE_isEE */
const Whitelist = React.lazy(
  () => import(/* webpackChunkName: "Whitelist" */ '../page/Whitelist')
);
/* FITRUE_isEE */
const WorkflowTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "WorkflowTemplate" */ '../page/WorkflowTemplate'
    )
);

const System = React.lazy(
  () => import(/* webpackChunkName: "System" */ '../page/System')
);

const AuditPlan = React.lazy(
  () => import(/* webpackChunkName: "AuditPlan" */ '../page/AuditPlan')
);

const AuditPlanDetail = React.lazy(
  () =>
    import(/* webpackChunkName: "PlanDetail" */ '../page/AuditPlan/PlanDetail')
);

const BindUser = React.lazy(
  () => import(/* webpackChunkName: "BindUser" */ '../page/BindUser')
);

const SqlQuery = React.lazy(
  () => import(/* webpackChunkName: "SqlQuery" */ '../page/SqlQuery')
);

const OrderSqlAnalyze = React.lazy(
  () =>
    import(/* webpackChunkName: "OrderSqlAnalyze" */ '../page/SqlAnalyze/Order')
);

const AuditPlanSqlAnalyze = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuditPlanSqlAnalyze" */ '../page/SqlAnalyze/AuditPlan'
    )
);

const ReportStatistics = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ReportStatistics" */ '../page/ReportStatistics'
    )
);

const ProjectList = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ProjectList" */ '../page/ProjectManage/ProjectList'
    )
);

const ProjectDetail = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ProjectDetail" */ '../page/ProjectManage/ProjectDetail'
    )
);
const ProjectOverview = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ProjectOverview" */ '../page/ProjectManage/ProjectOverview'
    )
);

const Member = React.lazy(
  () => import(/* webpackChunkName: "Member" */ '../page/Member')
);

export const unAuthRouter: Array<RouteProps & { key: string }> = [
  {
    path: '/login',
    component: Login,
    exact: true,
    key: 'login',
  },
  {
    path: '/user/bind',
    component: BindUser,
    exact: true,
    key: 'bindUser',
  },
];

export const globalRouterConfig: RouterItem<GlobalRouterItemKeyLiteral>[] = [
  {
    path: '/',
    exact: true,
    label: 'menu.dashboard',
    component: Home,
    icon: <PieChartOutlined />,
    key: 'dashboard',
  },
  {
    path: '/rule',
    exact: true,
    label: 'menu.rule',
    component: Rule,
    icon: <DesktopOutlined />,
    key: 'rule',
  },
  {
    path: '/sqlQuery',
    exact: true,
    label: 'menu.sqlQuery',
    component: SqlQuery,
    icon: <SearchOutlined />,
    key: 'sqlQuery',
  },

  {
    path: '/reportStatistics',
    exact: true,
    label: 'menu.reportStatistics',
    component: ReportStatistics,
    icon: <BarChartOutlined />,
    key: 'reportStatistics',
    role: [SystemRole.admin],
  },
  {
    path: '/account',
    exact: true,
    label: 'common.account',
    component: Account,
    hideInSliderMenu: true,
    key: 'account',
  },
  {
    label: 'menu.userCenter',
    icon: <UserOutlined />,
    key: 'userCenter',
    components: [
      {
        path: '/user',
        exact: true,
        label: 'menu.user',
        component: User,
        key: 'user',
      },
      {
        path: '/user/role',
        exact: true,
        label: 'menu.role',
        component: Role,
        key: 'role',
      },
      {
        path: '/user/group',
        exact: true,
        label: 'menu.userGroup',
        component: UserGroup,
        key: 'userGroup',
      },
    ],
  },
  {
    path: '/rule/template',
    key: 'globalRuleTemplate',
    label: 'menu.ruleTemplate',
    icon: <AuditOutlined />,
    component: GlobalRuleTemplate,
  },
  {
    path: '/system',
    key: 'System',
    label: 'menu.systemSetting',
    exact: true,
    component: System,
    icon: <SettingOutlined />,
  },
  {
    label: 'menu.projectManage',
    key: 'projectList',
    icon: <ProjectOutlined />,
    path: '/project',
    exact: true,
    component: ProjectList,
  },
  {
    label: 'menu.projectManage',
    key: 'projectDetail',
    icon: <ProjectOutlined />,
    path: '/project/:projectName',
    component: ProjectDetail,
  },
];

export const projectDetailRouterConfig: RouterItem<ProjectDetailRouterItemKeyLiteral>[] =
  [
    {
      label: 'menu.projectOverview',
      key: 'projectOverview',
      icon: <ProjectOutlined />,
      path: '/project/:projectName/overview',
      component: ProjectOverview,
    },
    {
      label: 'menu.order',
      key: 'order',
      icon: <ConsoleSqlOutlined />,
      components: [
        {
          path: '/project/:projectName/order',
          exact: true,
          label: 'menu.orderList',
          icon: <BarsOutlined />,
          component: OrderList,
          key: 'orderList',
        },
        {
          path: '/project/:projectName/order/create',
          exact: true,
          label: 'menu.workflow',
          component: CreateOrder,
          icon: <DesktopOutlined />,
          key: 'orderCreate',
          hideInSliderMenu: true,
        },
        {
          path: '/project/:projectName/order/:orderId',
          exact: true,
          label: 'menu.orderDetail',
          hideInSliderMenu: true,
          component: OrderDetail,
          key: 'orderDetail',
        },
        /* IFTRUE_isEE */
        {
          path: '/project/:projectName/order/:taskId/:sqlNum/analyze',
          exact: true,
          label: 'menu.orderSqlAnalyze',
          hideInSliderMenu: true,
          component: OrderSqlAnalyze,
          key: 'orderAnalyze',
        },
        /* FITRUE_isEE */
      ],
    },
    {
      label: 'menu.auditPlane',
      key: 'plane',
      icon: <CiCircleOutlined />,
      components: [
        {
          path: '/project/:projectName/auditPlan/detail/:auditPlanName',
          key: 'auditPlanDetail',
          label: 'menu.auditPlane',
          hideInSliderMenu: true,
          component: AuditPlanDetail,
        },
        /* IFTRUE_isEE */
        {
          path: '/project/:projectName/auditPlan/:reportId/:sqlNum/:auditPlanName/analyze',
          key: 'auditPlanDetail',
          exact: true,
          label: 'menu.auditPlanSqlAnalyze',
          component: AuditPlanSqlAnalyze,
          hideInSliderMenu: true,
        },
        /* FITRUE_isEE */
        {
          path: '/project/:projectName/auditPlan',
          key: 'auditPlan',
          label: 'menu.auditPlaneList',
          component: AuditPlan,
        },
      ],
    },
    {
      path: '/project/:projectName/data',
      key: 'data',
      label: 'menu.dataSource',
      icon: <DatabaseOutlined />,
      component: DataSource,
    },
    {
      path: '/project/:projectName/member',
      key: 'member',
      label: 'menu.member',
      icon: <UserOutlined />,
      component: Member,
    },
    {
      path: '/project/:projectName/rule/template',
      key: 'ruleTemplate',
      label: 'menu.ruleTemplate',
      icon: <AuditOutlined />,
      component: RuleTemplate,
    },
    {
      path: '/project/:projectName/progress',
      key: 'progress',
      label: 'menu.progressManage',
      icon: <NodeIndexOutlined />,
      component: WorkflowTemplate,
    },
    /* IFTRUE_isEE */
    {
      path: '/project/:projectName/whitelist',
      key: 'Whitelist',
      label: 'menu.whitelist',
      component: Whitelist,
      icon: <ProfileOutlined />,
    },
    /* FITRUE_isEE */
  ];
