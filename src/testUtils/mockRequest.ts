import { AxiosResponse } from 'axios';
import instance from '../api/instance';
import role from '../api/role';
import ruleTemplate from '../api/rule_template';
import user from '../api/user';
import configuration from '../api/configuration';
import user_group from '../api/user_group';
import operation from '../api/operation';
import audit_plan from '../api/audit_plan';
import management_permission from '../api/management_permission';
import project from '../api/project';
import sync_instance from '../api/sync_instance';
import OperationRecord from '../api/OperationRecord';
import { driverMeta } from '../hooks/useDatabaseType/index.test.data';
import {
  mockBindProjects,
  mockManagementPermissions,
} from '../hooks/useCurrentUser/index.test.data';

export const successData = (data: any, otherData?: any) => {
  return {
    code: 0,
    message: '',
    data,
    ...otherData,
  };
};

export const failedData = (data?: any, otherData?: any) => {
  return {
    code: 100,
    message: 'error',
    data,
    ...otherData,
  };
};

export const resolveImmediately = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return Promise.resolve({
    status,
    headers,
    config,
    statusText,
    data: successData(data),
  });
};

export const rejectImmediately = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return Promise.reject({
    status,
    headers,
    config,
    statusText,
    data: failedData(data),
  });
};

export const resolveThreeSecond = (
  data: any,
  {
    status = 200,
    headers = {},
    config = {},
    statusText = '',
    otherData = {},
  } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        data: successData(data, otherData),
      });
    }, 3000);
  });
};

export const resolveErrorThreeSecond = (
  data: any,
  {
    status = 200,
    headers = {},
    config = {},
    statusText = '',
    otherData = {},
  } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        data: failedData(data, otherData),
      });
    }, 3000);
  });
};

export const rejectThreeSecond = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((_, rej) => {
    setTimeout(() => {
      rej({
        status,
        headers,
        config,
        statusText,
        data: failedData(data),
      });
    }, 3000);
  });
};

export const throwErrorThreeSecond = (
  error = 'error',
  { status = 500, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise((res) => {
    throw new Error(error);
  });
};

export const mockUseInstance = () => {
  const spy = jest.spyOn(instance, 'getInstanceTipListV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([{ instance_name: 'instance1', instance_type: 'mysql' }])
  );
  return spy;
};

export const mockUseInstanceSchema = () => {
  const spy = jest.spyOn(instance, 'getInstanceSchemasV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({ schema_name_list: ['schema1'] })
  );
  return spy;
};

export const mockUseRole = () => {
  const spy = jest.spyOn(role, 'getRoleTipListV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([{ role_name: 'role_name1' }])
  );
  return spy;
};

export const mockUseUserGroup = () => {
  const spy = jest.spyOn(user_group, 'getUserGroupTipListV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([{ user_group_name: 'user_group_name1' }])
  );
  return spy;
};

export const mockUseOperation = () => {
  const spy = jest.spyOn(operation, 'GetOperationsV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        op_code: 20100,
        op_desc: '查看工单',
      },
      {
        op_code: 20150,
        op_desc: '查看他人创建的工单',
      },
      {
        op_code: 20200,
        op_desc: '更新工单',
      },
      {
        op_code: 20300,
        op_desc: '创建工单',
      },
      {
        op_code: 20400,
        op_desc: '删除工单',
      },
    ])
  );
  return spy;
};

export const mockUseRuleTemplate = () => {
  const spy = jest.spyOn(ruleTemplate, 'getProjectRuleTemplateTipsV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      { rule_template_name: 'rule_template_name1', db_type: 'mysql' },
      { rule_template_name: 'rule_template_name2', db_type: 'oracle' },
    ])
  );
  return spy;
};

export const mockUseGlobalRuleTemplate = () => {
  const spy = jest.spyOn(ruleTemplate, 'getRuleTemplateTipsV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      { rule_template_name: 'global_rule_template_name1', db_type: 'mysql' },
      { rule_template_name: 'global_rule_template_name2', db_type: 'oracle' },
    ])
  );
  return spy;
};

export const mockUseUsername = () => {
  const spy = jest.spyOn(user, 'getUserTipListV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([{ user_name: 'user_name1' }])
  );
  return spy;
};

export const mockDriver = () => {
  const spy = jest.spyOn(configuration, 'getDriversV2');
  spy.mockImplementation(() => resolveThreeSecond(driverMeta));
  return spy;
};

export const mockInstanceTip = () => {
  const spy = jest.spyOn(instance, 'getInstanceTipListV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        instance_name: 'mysql-test',
        instance_type: 'mysql',
      },
      {
        instance_name: 'oracle-test',
        instance_type: 'oracle',
      },
    ])
  );
  return spy;
};

export const mockManagerPermission = () => {
  const spy = jest.spyOn(management_permission, 'GetManagementPermissionsV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        code: 1,
        desc: '创建项目',
      },
    ])
  );
  return spy;
};

export const mockUseProject = () => {
  const spy = jest.spyOn(project, 'getProjectTipsV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        project_name: 'project_name_1',
      },
      {
        project_name: 'project_name_2',
      },
    ])
  );
  return spy;
};

export const mockUseMember = () => {
  const spy = jest.spyOn(user, 'getMemberTipListV1');
  spy.mockImplementation(() => resolveThreeSecond([{ user_name: 'member1' }]));
  return spy;
};

export const mockUseTaskSource = () => {
  const spy = jest.spyOn(sync_instance, 'GetSyncTaskSourceTips');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      { source: 'source1', db_types: ['mysql'] },
      { source: 'source2', db_types: ['oracle'] },
    ])
  );
  return spy;
};

export const mockUseOperationTypeName = () => {
  const spy = jest.spyOn(OperationRecord, 'GetOperationTypeNameList');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      { operation_type_name: 'project', desc: '项目' },
      { operation_type_name: 'instance', desc: '数据源' },
    ])
  );
  return spy;
};

export const mockGetCurrentUser = () => {
  const spy = jest.spyOn(user, 'getCurrentUserV1');

  spy.mockImplementation(() =>
    resolveThreeSecond({
      user_name: 'test',
      is_admin: '',
      bind_projects: mockBindProjects,
      management_permission_list: mockManagementPermissions,
    })
  );
  return spy;
};

export const mockUseRuleType = () => {
  const spy = jest.spyOn(ruleTemplate, 'getRuleTypeByDBTypeV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        rule_count: 0,
        rule_type: 'DML1',
      },
      {
        rule_count: 3,
        rule_type: 'DML2',
      },
    ])
  );

  return spy;
};

export const mockUseOperationActions = () => {
  const spy = jest.spyOn(OperationRecord, 'getOperationActionList');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        operation_action: 'edit_instance',
        desc: '编辑数据源',
        operation_type: 'instance',
      },
      {
        operation_action: 'create_project',
        desc: '创建项目',
        operation_type: 'project',
      },
    ])
  );
  return spy;
};

export const AuditPlanTypesData = [
  { type: 'default', desc: '自定义', instance_type: '' },
  { type: 'mysql_slow_log', desc: '慢日志', instance_type: 'MySQL' },
  { type: 'mysql_mybatis', desc: 'Mybatis 扫描', instance_type: 'MySQL' },
  { type: 'mysql_schema_meta', desc: '库表元数据', instance_type: 'MySQL' },
  {
    type: 'ali_rds_mysql_slow_log',
    desc: '阿里RDS MySQL慢日志',
    instance_type: 'MySQL',
  },
  {
    type: 'ali_rds_mysql_audit_log',
    desc: '阿里RDS MySQL审计日志',
    instance_type: 'MySQL',
  },
  { type: 'oracle_top_sql', desc: 'Oracle TOP SQL', instance_type: 'Oracle' },
  { type: 'all_app_extract', desc: '应用程序SQL抓取', instance_type: '' },
  { type: 'tidb_audit_log', desc: 'TiDB审计日志', instance_type: 'TiDB' },
  {
    type: 'ocean_base_for_mysql_mybatis',
    desc: 'Mybatis 扫描',
    instance_type: '',
  },
  { type: 'ocean_base_for_mysql_top_sql', desc: 'Top SQL', instance_type: '' },
];
export const mockUseAuditPlanTypes = () => {
  const spy = jest.spyOn(audit_plan, 'getAuditPlanTypesV1');
  spy.mockImplementation(() => resolveThreeSecond(AuditPlanTypesData));
  return spy;
};
