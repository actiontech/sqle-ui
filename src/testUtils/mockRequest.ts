import { AxiosResponse } from 'axios';
import instance from '../api/instance';
import role from '../api/role';
import ruleTemplate from '../api/rule_template';
import user from '../api/user';
import workflow from '../api/workflow';
import configuration from '../api/configuration';
import user_group from '../api/user_group';
import operation from '../api/operation';
import audit_plan from '../api/audit_plan';
import management_permission from '../api/management_permission';
import project from '../api/project';

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
  const spy = jest.spyOn(configuration, 'getDriversV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({ driver_name_list: ['oracle', 'mysql'] })
  );
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

export const AuditPlanTypesData = [
  { type: 'default', desc: '自定义' },
  { type: 'mysql_slow_log', desc: '慢日志' },
  { type: 'mysql_mybatis', desc: 'Mybatis 扫描' },
  { type: 'mysql_schema_meta', desc: '库表元数据' },
  { type: 'ali_rds_mysql_slow_log', desc: '阿里RDS MySQL慢日志' },
  { type: 'ali_rds_mysql_audit_log', desc: '阿里RDS MySQL审计日志' },
  { type: 'oracle_top_sql', desc: 'Oracle TOP SQL' },
  { type: 'all_app_extract', desc: '应用程序SQL抓取' },
  { type: 'tidb_audit_log', desc: 'TiDB审计日志' },
  { type: 'ocean_base_for_mysql_mybatis', desc: 'Mybatis 扫描' },
  { type: 'ocean_base_for_mysql_top_sql', desc: 'Top SQL' },
];
export const mockUseAuditPlanTypes = () => {
  const spy = jest.spyOn(audit_plan, 'getAuditPlanTypesV1');
  spy.mockImplementation(() => resolveThreeSecond(AuditPlanTypesData));
  return spy;
};
