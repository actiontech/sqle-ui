import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import {
  GlobalRouterItemKeyLiteral,
  ProjectDetailRouterItemKeyLiteral,
  RouterConfigItem,
} from '../types/router.type';
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  DatabaseOutlined,
  AuditOutlined,
  ConsoleSqlOutlined,
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

const UserCenter = React.lazy(
  () => import(/* webpackChunkName: "UserCenter" */ '../page/UserCenter')
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

const RuleManager = React.lazy(
  () => import(/* webpackChunkName: "RuleManager" */ '../page/RuleManager')
);

const GlobalRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "GlobalRuleTemplate" */ '../page/GlobalRuleTemplate'
    )
);

const CustomRule = React.lazy(
  () => import(/* webpackChunkName: "CustomRule" */ '../page/CustomRule')
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

const Whitelist = React.lazy(
  () => import(/* webpackChunkName: "Whitelist" */ '../page/Whitelist')
);

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

const SyncDataSource = React.lazy(
  () =>
    import(/* webpackChunkName: "SyncDataSource" */ '../page/SyncDataSource')
);

const OperationRecord = React.lazy(
  () =>
    import(/* webpackChunkName: "OperationRecord" */ '../page/OperationRecord')
);

const CreateAuditPlan = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateAuditPlan" */ '../page/AuditPlan/CreatePlan'
    )
);
const AuditPlanReport = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuditPlanReport" */ '../page/AuditPlan/PlanDetail/Detail/Report'
    )
);
const AuditPlanList = React.lazy(
  () =>
    import(/* webpackChunkName: "AuditPlanList" */ '../page/AuditPlan/PlanList')
);
const UpdateAuditPlan = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuditPlanList" */ '../page/AuditPlan/UpdatePlan'
    )
);
const AddDataSource = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AddDataSource" */ '../page/DataSource/AddDataSource'
    )
);
const DataSourceList = React.lazy(
  () =>
    import(
      /* webpackChunkName: "DataSourceList" */ '../page/DataSource/DataSourceList'
    )
);

const UpdateDataSource = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateDataSource" */ '../page/DataSource/UpdateDataSource'
    )
);

const CreateRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateRuleTemplate" */ '../page/RuleTemplate/CreateRuleTemplate'
    )
);

const ImportRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ImportRuleTemplate" */ '../page/RuleTemplate/ImportRuleTemplate'
    )
);

const RuleTemplateList = React.lazy(
  () =>
    import(
      /* webpackChunkName: "RuleTemplateList" */ '../page/RuleTemplate/RuleTemplateList'
    )
);

const UpdateRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateRuleTemplate" */ '../page/RuleTemplate/UpdateRuleTemplate'
    )
);

const UpdateWorkflowTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateWorkflowTemplate" */ '../page/WorkflowTemplate/UpdateWorkflowTemplate'
    )
);

const WorkflowTemplateDetail = React.lazy(
  () =>
    import(
      /* webpackChunkName: "WorkflowTemplateDetail" */ '../page/WorkflowTemplate/WorkflowTemplateDetail'
    )
);

const SyncTaskList = React.lazy(
  () =>
    import(
      /* webpackChunkName: "SyncTaskList" */ '../page/SyncDataSource/SyncTaskList'
    )
);

const AddSyncTask = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AddSyncTask" */ '../page/SyncDataSource/AddSyncTask'
    )
);

const UpdateSyncTask = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateSyncTask" */ '../page/SyncDataSource/UpdateSyncTask'
    )
);

export const unAuthRouter: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/user/bind',
    element: <BindUser />,
  },
  {
    path: '*',
    element: <Navigate to="/login" />,
  },
];

export const projectDetailRouterConfig: RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[] =
  [
    {
      label: 'menu.projectOverview',
      key: 'projectOverview',
      icon: <ProjectOutlined />,
      path: 'overview',
      element: <ProjectOverview />,
    },
    {
      label: 'menu.order',
      key: 'order',
      icon: <ConsoleSqlOutlined />,
      hideChildrenInSliderMenu: true,
      path: 'order',
      children: [
        {
          index: true,
          element: <OrderList />,
          key: 'orderList',
        },
        {
          path: 'create',
          element: <CreateOrder />,
          icon: <DesktopOutlined />,
          key: 'orderCreate',
        },
        {
          path: ':orderId',
          element: <OrderDetail />,
          key: 'orderDetail',
        },
        /* IFTRUE_isEE */
        {
          path: ':taskId/:sqlNum/analyze',
          label: 'menu.orderSqlAnalyze',
          hideInSliderMenu: true,
          element: <OrderSqlAnalyze />,
          key: 'orderAnalyze',
        },
        /* FITRUE_isEE */
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[],
    },
    {
      key: 'plane',
      label: 'menu.auditPlane',
      icon: <CiCircleOutlined />,
      element: <AuditPlan />,
      children: [
        {
          key: 'auditPlan',
          label: 'menu.auditPlaneList',
          path: 'auditPlan',
          hideChildrenInSliderMenu: true,
          children: [
            {
              index: true,
              element: <AuditPlanList />,
              key: 'auditPlan',
            },
            {
              path: 'create',
              element: <CreateAuditPlan />,
              key: 'auditPlanCreate',
            },
            {
              path: 'update/:auditPlanName',
              element: <UpdateAuditPlan />,
              key: 'auditPlanUpdate',
            },
            {
              path: 'detail/:auditPlanName',
              key: 'auditPlanDetail',
              label: 'menu.auditPlane',
              hideInSliderMenu: true,
              element: <AuditPlanDetail />,
              children: [
                {
                  path: 'report/:reportId',
                  key: 'auditPlanDetailReport',
                  hideInSliderMenu: true,
                  element: <AuditPlanReport />,
                },
              ],
            },
            /* IFTRUE_isEE */
            {
              path: ':reportId/:sqlNum/:auditPlanName/analyze',
              key: 'auditPlanDetail',
              label: 'menu.auditPlanSqlAnalyze',
              element: <AuditPlanSqlAnalyze />,
              hideInSliderMenu: true,
            },
            /* FITRUE_isEE */
          ],
          groups: [
            {
              title: '',
              values: [
                {
                  path: 'auditPlan',
                  key: 'auditPlan',
                  label: 'menu.auditPlane',
                  element: <AuditPlan />,
                },
              ],
            },
          ],
        },
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[],
    },
    {
      path: 'data',
      key: 'data',
      label: 'menu.dataSource',
      icon: <DatabaseOutlined />,
      element: <DataSource />,
      hideChildrenInSliderMenu: true,
      children: [
        {
          index: true,
          element: <DataSourceList />,
          key: 'data',
        },
        {
          path: 'create',
          element: <AddDataSource />,
          key: 'dataCreate',
        },
        {
          path: 'update/:instanceName',
          element: <UpdateDataSource />,
          key: 'dataUpdate',
        },
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[],
    },
    {
      path: 'member',
      key: 'member',
      label: 'menu.member',
      icon: <UserOutlined />,
      element: <Member />,
    },
    {
      path: 'rule/template',
      key: 'ruleTemplate',
      label: 'menu.ruleTemplate',
      icon: <AuditOutlined />,
      element: <RuleTemplate />,
      hideChildrenInSliderMenu: true,
      children: [
        {
          index: true,
          element: <RuleTemplateList />,
          key: 'ruleTemplate',
        },
        {
          path: 'create',
          element: <CreateRuleTemplate />,
          key: 'ruleTemplateCreate',
        },
        {
          path: 'import',
          element: <ImportRuleTemplate />,
          key: 'ruleTemplateImport',
        },
        {
          path: 'update/:templateName',
          element: <UpdateRuleTemplate />,
          key: 'ruleTemplateImport',
        },
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[],
    },
    {
      path: 'progress',
      key: 'progress',
      label: 'menu.progressManage',
      icon: <NodeIndexOutlined />,
      element: <WorkflowTemplate />,
      hideChildrenInSliderMenu: true,
      children: [
        {
          index: true,
          element: <WorkflowTemplateDetail />,
          key: 'progressDetail',
        },
        {
          path: 'update/:workflowName',
          element: <UpdateWorkflowTemplate />,
          key: 'progressUpdate',
        },
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[],
    },
    {
      path: 'whitelist',
      key: 'Whitelist',
      label: 'menu.whitelist',
      element: <Whitelist />,
      icon: <ProfileOutlined />,
    },
    /* IFTRUE_isEE */
    {
      path: '*',
      key: 'projectRedirect',
      element: <Navigate to="overview" />,
      hideInSliderMenu: true,
      label: 'menu.projectOverview',
    },
    /* FITRUE_isEE */
  ];

export const globalRouterConfig: RouterConfigItem<
  GlobalRouterItemKeyLiteral | ProjectDetailRouterItemKeyLiteral
>[] = [
  {
    path: 'home',
    label: 'menu.dashboard',
    element: <Home />,
    icon: <PieChartOutlined />,
    key: 'dashboard',
  },
  {
    label: 'menu.projectManage',
    key: 'projectList',
    icon: <ProjectOutlined />,
    path: 'project',
    element: <ProjectList />,
  },
  {
    label: 'menu.projectManage',
    key: 'projectDetail',
    icon: <ProjectOutlined />,
    path: 'project/:projectName',
    element: <ProjectDetail />,
    children: projectDetailRouterConfig,
  },
  {
    path: 'sqlQuery',
    label: 'menu.sqlQuery',
    element: <SqlQuery />,
    icon: <SearchOutlined />,
    key: 'sqlQuery',
  },

  {
    path: 'reportStatistics',
    label: 'menu.reportStatistics',
    element: <ReportStatistics />,
    icon: <BarChartOutlined />,
    key: 'reportStatistics',
    role: [SystemRole.admin],
  },
  {
    path: 'account',
    label: 'common.account',
    element: <Account />,
    hideInSliderMenu: true,
    key: 'account',
  },
  {
    path: 'userCenter',
    label: 'menu.userCenter',
    icon: <UserOutlined />,
    key: 'userCenter',
    element: <UserCenter />,
  },
  {
    path: 'rule',
    label: 'menu.rule',
    element: <Rule />,
    icon: <DesktopOutlined />,
    key: 'rule',
  },
  {
    key: 'ruleManager',
    icon: <AuditOutlined />,
    element: <RuleManager />,
    path: 'rule',
    children: [
      {
        path: 'template',
        key: 'globalRuleTemplate',
        element: <GlobalRuleTemplate />,
        children: [
          {
            path: 'create',
            key: 'globalRuleTemplateCreate',
          },
          {
            path: 'import',
            key: 'globalRuleTemplateImport',
          },
          {
            path: 'update/:templateName',
            key: 'globalRuleTemplateUpdate',
          },
        ],
      },
      /* IFTRUE_isEE */
      {
        key: 'customRule',
        element: <CustomRule />,
        path: 'custom',
        children: [
          {
            path: 'create',
            key: 'createCustomRule',
          },
          {
            path: 'update/:ruleID',
            key: 'updateCustomRule',
          },
        ],
      },
      /* FITRUE_isEE */
    ] as RouterConfigItem<GlobalRouterItemKeyLiteral>[],
  },
  {
    path: 'system',
    key: 'System',
    label: 'menu.systemSetting',
    element: <System />,
    icon: <SettingOutlined />,
  },
  {
    path: 'syncDataSource',
    label: 'menu.syncDataSource',
    key: 'syncDataSource',
    element: <SyncDataSource />,
    children: [
      {
        index: true,
        element: <SyncTaskList />,
        key: 'syncDataSourceList',
      },
      {
        path: 'create',
        element: <AddSyncTask />,
        key: 'syncDataSourceCreate',
      },
      {
        path: 'update/:taskId',
        element: <UpdateSyncTask />,
        key: 'syncDataSourceUpdate',
      },
    ] as RouterConfigItem<GlobalRouterItemKeyLiteral>[],
  },
  /* IFTRUE_isEE */
  {
    path: 'operationRecord',
    label: 'menu.operationRecord',
    key: 'operationRecord',
    element: <OperationRecord />,
    role: [SystemRole.admin],
  },
  /* FITRUE_isEE */
  {
    path: '*',
    key: 'redirect',
    element: <Navigate to="home" />,
    hideInSliderMenu: true,
    label: 'menu.dashboard',
  },
];
