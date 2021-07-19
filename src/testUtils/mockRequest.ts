import { AxiosResponse } from 'axios';
import instance from '../api/instance';
import role from '../api/role';
import ruleTemplate from '../api/rule_template';
import user from '../api/user';
import workflow from '../api/workflow';

export const successData = (data: any, otherData?: any) => {
  return {
    code: 0,
    message: '',
    data,
    ...otherData,
  };
};

export const failedData = (data?: any) => {
  return {
    code: 100,
    message: 'error',
    data,
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
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        data: failedData(data),
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
    resolveThreeSecond([{ instance_name: 'instance1' }])
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

export const mockUseRuleTemplate = () => {
  const spy = jest.spyOn(ruleTemplate, 'getRuleTemplateTipsV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([{ rule_template_name: 'rule_template_name1' }])
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

export const mockUseWorkflowTemplate = () => {
  const spy = jest.spyOn(workflow, 'getWorkflowTemplateTipsV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([{ workflow_template_name: 'workflow-template-name-1' }])
  );
  return spy;
};
