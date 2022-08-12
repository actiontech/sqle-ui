import {
  IInstancesTypePercentV1,
  ILicenseUsageV1,
  ITaskCountsV1,
  ITaskCreatedCountsEachDayV1,
  ITaskPassPercentV1,
  ITaskRejectedPercentGroupByCreator,
  ITaskRejectedPercentGroupByInstance,
  ITasksPercentCountedByInstanceTypeV1,
  ITaskStageDuration,
  ITaskStatusCountV1,
} from '../../../../api/common';

const DiffInstanceOrderRejectedPercentData: ITaskRejectedPercentGroupByInstance[] =
  Array.from({ length: 10 }, (_, i) => {
    return {
      instance_name: `instance${i}`,
      task_total_num: 22,
      rejected_percent: 12.66666,
    };
  });

const DiffUserOrderRejectedPercentData: ITaskRejectedPercentGroupByCreator[] =
  Array.from({ length: 10 }, (_, i) => {
    return {
      creator: `user${i}`,
      task_total_num: 22,
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
      is_limited: false,
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
      limit: 0,
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
    limit: 100,
    resource_type: 'user',
    used: 20,
  },
};
const OrderAverageExecuteTimeData: ITaskStageDuration = {
  minutes: 114,
};

const OrderAverageReviewTimeData: ITaskStageDuration = {
  minutes: 114,
};

const OrderPassPercentData: ITaskPassPercentV1 = {
  audit_pass_percent: 22.3,
  execution_success_percent: 33.2,
};

const OrderQuantityTrendData: ITaskCreatedCountsEachDayV1 = {
  samples: Array.from({ length: 30 }, (_, i) => {
    const cur = i + 1;
    return {
      date: `2022-08-${cur < 10 ? '0' + cur : cur}`,
      value: 33,
    };
  }),
};

const OrderQuantityWithDbTypeData: ITasksPercentCountedByInstanceTypeV1 = {
  task_percents: [
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
  task_total_num: 70,
};

const OrderStatusData: ITaskStatusCountV1 = {
  closed_count: 12,

  executing_count: 32,

  execution_success_count: 22,

  rejected_count: 34,

  waiting_for_audit_count: 22,

  waiting_for_execution_count: 12,
};

const OrderTotalNumbersData: ITaskCountsV1 = { total: 100, today_count: 10 };

const mockRequestData = {
  DiffInstanceOrderRejectedPercentData,
  DiffUserOrderRejectedPercentData,
  InstanceProportionWithDbTypeData,
  LicenseUsageData,
  OrderAverageExecuteTimeData,
  OrderAverageReviewTimeData,
  OrderPassPercentData,
  OrderQuantityTrendData,
  OrderQuantityWithDbTypeData,
  OrderStatusData,
  OrderTotalNumbersData,
};

export default mockRequestData;
