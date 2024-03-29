import {
  IInstancesTypePercentV1,
  ILicenseUsageV1,
  IWorkflowCountsV1,
  IWorkflowStatusCountV1,
  IWorkflowRejectedPercentGroupByCreator,
  IWorkflowPercentCountedByInstanceTypeV1,
  IWorkflowCreatedCountsEachDayV1,
  IWorkflowPassPercentV1,
  IWorkflowStageDuration,
  ISqlExecutionFailPercent,
  ISqlAverageExecutionTime,
} from '../../../../api/common';

const DiffUserOrderRejectedPercentData: IWorkflowRejectedPercentGroupByCreator[] =
  Array.from({ length: 10 }, (_, i) => {
    return {
      creator: `user${i}`,
      workflow_total_num: 22,
      rejected_percent: 12.34,
    };
  });
const InstanceProportionWithDbTypeData: IInstancesTypePercentV1 = {
  instance_total_num: 70,
  instance_type_percents: [
    {
      type: 'Mysql',
      count: 27,
    },
    {
      type: 'Oracle',
      count: 25,
    },
    {
      type: 'Redis',
      count: 18,
    },
    {
      type: 'MongoDB',
      count: 15,
    },
    {
      type: 'TiDB',
      count: 5,
    },
  ],
};
const LicenseUsageData: ILicenseUsageV1 = {
  instances_usage: [
    {
      is_limited: true,
      limit: 100,
      resource_type: 'test1',
      used: 10,
    },
    {
      is_limited: true,
      limit: 100,
      resource_type: 'test2',
      used: 20,
    },
    {
      is_limited: true,
      limit: 100,
      resource_type: 'test3',
      used: 30,
    },
    {
      is_limited: true,
      limit: 100,
      resource_type: 'test4',
      used: 110,
    },
    {
      is_limited: true,
      limit: 100,
      resource_type: 'test4',
      used: 0,
    },
  ],
  users_usage: {
    is_limited: true,
    limit: 100,
    resource_type: 'user',
    used: 20,
  },
};

const OrderAverageReviewTimeData: IWorkflowStageDuration = {
  minutes: 114,
};

const OrderPassPercentData: IWorkflowPassPercentV1 = {
  audit_pass_percent: 22.3,
};

const OrderQuantityTrendData: IWorkflowCreatedCountsEachDayV1 = {
  samples: Array.from({ length: 30 }, (_, i) => {
    const cur: number = i + 1;
    return {
      date: `2022-08-${cur < 10 ? '0' + cur : cur}`,
      value: 33,
    };
  }),
};

const OrderQuantityWithDbTypeData: IWorkflowPercentCountedByInstanceTypeV1 = {
  workflow_percents: [
    {
      instance_type: 'Mysql',
      count: 27,
    },
    {
      instance_type: 'Oracle',
      count: 25,
    },
    {
      instance_type: 'Redis',
      count: 18,
    },
    {
      instance_type: 'MongoDB',
      count: 15,
    },
    {
      instance_type: 'TiDB',
      count: 5,
    },
  ],
  workflow_total_num: 70,
};

const OrderStatusData: IWorkflowStatusCountV1 = {
  closed_count: 12,

  executing_count: 32,

  execution_success_count: 22,

  rejected_count: 34,

  waiting_for_audit_count: 22,

  waiting_for_execution_count: 12,
};

const OrderTotalNumbersData: IWorkflowCountsV1 = {
  total: 100,
  today_count: 10,
};

const SqlExecFailedTopNData: ISqlExecutionFailPercent[] = Array.from(
  { length: 10 },
  (_, i) => {
    return {
      instance_name: `instance_name${i}`,
      percent: 11.11,
    };
  }
);

const SqlAverageExecutionTimeData: ISqlAverageExecutionTime[] = Array.from(
  { length: 10 },
  (_, i) => {
    return {
      instance_name: `instance_name${i}`,
      average_execution_seconds: 3,
      max_execution_seconds: 4,
      min_execution_seconds: 5,
    };
  }
);

const mockRequestData = {
  DiffUserOrderRejectedPercentData,
  InstanceProportionWithDbTypeData,
  LicenseUsageData,
  SqlAverageExecutionTimeData,
  OrderAverageReviewTimeData,
  OrderPassPercentData,
  OrderQuantityTrendData,
  OrderQuantityWithDbTypeData,
  OrderStatusData,
  OrderTotalNumbersData,
  SqlExecFailedTopNData,
};

export default mockRequestData;
