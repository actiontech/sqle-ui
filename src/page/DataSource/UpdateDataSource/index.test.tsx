import { fireEvent, screen, act } from '@testing-library/react';
import UpdateDataSource from '.';
import instance from '../../../api/instance';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import {
  mockUseGlobalRuleTemplate,
  mockUseRuleTemplate,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { useParams } from 'react-router-dom';

import { mockDriver } from '../../../testUtils/mockRequest';
import { dataSourceMetas } from '../__testData__';
import {
  getBySelector,
  getSelectValueByFormLabel,
} from '../../../testUtils/customQuery';
import { SQLE_INSTANCE_SOURCE_NAME } from '../../../data/common';
import useNavigate from '../../../hooks/useNavigate';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

jest.mock('../../../hooks/useNavigate', () => jest.fn());
const projectName = 'default';

const instanceData = {
  additional_params: [
    { description: '字段a', name: 'a', type: 'string', value: '123' },
    { description: '字段b', name: 'b', type: 'int', value: '123' },
    { description: '字段c', name: 'c', type: 'bool', value: 'true' },
  ],
  instance_name: 'db1',
  db_host: '20.20.20.2',
  db_port: '3306',
  db_user: 'root',
  db_type: 'mysql',
  desc: '',
  maintenance_times: [
    {
      maintenance_start_time: {
        hour: 23,
        minute: 0,
      },
      maintenance_stop_time: {
        hour: 23,
        minute: 30,
      },
    },
    {
      maintenance_start_time: {
        hour: 0,
        minute: 0,
      },
      maintenance_stop_time: {
        hour: 2,
        minute: 0,
      },
    },
  ],
  rule_template_name: 'default_MySQL',
  sql_query_config: {
    allow_query_when_less_than_audit_level: 'notice',
    audit_enabled: true,
  },
  source: SQLE_INSTANCE_SOURCE_NAME,
};

describe('UpdateDataSource', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getInstanceSpy: jest.SpyInstance;
  const navigateSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ instanceName: '1', projectName });
    mockUseRuleTemplate();
    getInstanceSpy = mockGetInstance();
    mockDriver();
    mockGetDataSourceMetas();
    mockUseGlobalRuleTemplate();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockUpdateInstanceRequest = () => {
    const spy = jest.spyOn(instance, 'updateInstanceV1');
    spy.mockImplementation(() => resolveThreeSecond(undefined));
    return spy;
  };

  const mockGetDataSourceMetas = () => {
    const spy = jest.spyOn(instance, 'getInstanceAdditionalMetas');
    spy.mockImplementation(() => resolveThreeSecond(dataSourceMetas));
    return spy;
  };

  const mockGetInstance = () => {
    const spy = jest.spyOn(instance, 'getInstanceV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceData));
    return spy;
  };

  test('should render data source form', async () => {
    const { container } = renderWithThemeAndRouter(<UpdateDataSource />);
    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  test('should send update instance request when click submit', async () => {
    const updateSpy = mockUpdateInstanceRequest();
    renderWithThemeAndRouter(<UpdateDataSource />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.name'), {
      target: { value: 'instance_name1' },
    });
    fireEvent.input(
      screen.getByLabelText('dataSource.dataSourceForm.describe'),
      {
        target: { value: 'desc1' },
      }
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByLabelText('dataSource.dataSourceForm.type')
    ).toBeDisabled();

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.ip'), {
      target: { value: '1.1.1.1' },
    });
    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.port'), {
      target: { value: 4444 },
    });
    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.user'), {
      target: { value: 'root' },
    });
    fireEvent.input(
      screen.getByLabelText('dataSource.dataSourceForm.password'),
      {
        target: { value: '123456' },
      }
    );

    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.ruleTemplate')
    );
    await screen.findAllByText('rule_template_name1');
    expect(screen.queryByText('role_template_name2')).not.toBeInTheDocument();
    const allInstanceOptions = screen.getAllByText('rule_template_name1');
    const instanceOption = allInstanceOptions[1];
    expect(instanceOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instanceOption);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );

    fireEvent.click(screen.getByText('common.add'));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.ant-picker-range'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getAllByText('04')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('OK'));

    fireEvent.click(screen.getAllByText('05')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('OK'));

    fireEvent.click(screen.getByText('common.ok'));

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      additional_params: [
        {
          name: 'a',
          value: '123',
        },
        {
          name: 'b',
          value: '123',
        },
        {
          name: 'c',
          value: 'true',
        },
      ],
      db_host: '1.1.1.1',
      db_password: '123456',
      db_port: '4444',
      db_user: 'root',
      db_type: 'mysql',
      desc: 'desc1',
      instance_name: 'instance_name1',
      project_name: 'default',

      rule_template_name: 'rule_template_name1',
      maintenance_times: [
        {
          maintenance_start_time: {
            hour: 23,
            minute: 0,
          },
          maintenance_stop_time: {
            hour: 23,
            minute: 30,
          },
        },
        {
          maintenance_start_time: {
            hour: 0,
            minute: 0,
          },
          maintenance_stop_time: {
            hour: 2,
            minute: 0,
          },
        },
        {
          maintenance_start_time: {
            hour: 4,
            minute: 0,
          },
          maintenance_stop_time: {
            hour: 5,
            minute: 0,
          },
        },
      ],
      sql_query_config: {
        allow_query_when_less_than_audit_level: 'notice',
        audit_enabled: true,
      },
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('dataSource.updateDatabase.updateDatabaseSuccess')
    ).toBeInTheDocument();
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith(`project/${projectName}/data`, {
      replace: true,
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });

  test('should be disabled partial form items when the instance source is not SQLE', async () => {
    getInstanceSpy.mockImplementation(() =>
      resolveThreeSecond({ ...instanceData, source: 'DMP' })
    );
    const updateSpy = mockUpdateInstanceRequest();

    const { container } = renderWithThemeAndRouter(
      <UpdateDataSource />,
      undefined
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByLabelText('dataSource.dataSourceForm.name')
    ).toBeDisabled();
    expect(
      screen.getByLabelText('dataSource.dataSourceForm.describe')
    ).toBeDisabled();
    expect(
      screen.getByLabelText('dataSource.dataSourceForm.type')
    ).toBeDisabled();

    expect(
      screen.getByLabelText('dataSource.dataSourceForm.ip')
    ).toBeDisabled();

    expect(
      screen.getByLabelText('dataSource.dataSourceForm.port')
    ).toBeDisabled();

    expect(
      screen.getByLabelText('dataSource.dataSourceForm.user')
    ).toBeDisabled();

    expect(
      screen.getByLabelText('dataSource.dataSourceForm.password')
    ).toBeDisabled();

    expect(
      screen.getByLabelText('dataSource.dataSourceForm.ruleTemplate')
    ).not.toBeDisabled();
    expect(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    ).not.toBeDisabled();
    expect(
      screen.getByLabelText(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )
    ).not.toBeDisabled();

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      additional_params: [
        {
          name: 'a',
          value: '123',
        },
        {
          name: 'b',
          value: '123',
        },
        {
          name: 'c',
          value: 'true',
        },
      ],

      instance_name: 'db1',
      project_name: 'default',
      maintenance_times: [
        {
          maintenance_start_time: {
            hour: 23,
            minute: 0,
          },
          maintenance_stop_time: {
            hour: 23,
            minute: 30,
          },
        },
        {
          maintenance_start_time: {
            hour: 0,
            minute: 0,
          },
          maintenance_stop_time: {
            hour: 2,
            minute: 0,
          },
        },
      ],
      rule_template_name: 'default_MySQL',
      sql_query_config: {
        allow_query_when_less_than_audit_level: 'notice',
        audit_enabled: true,
      },
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('dataSource.updateDatabase.updateDatabaseSuccess')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
  });

  test('should be hidden "allowQueryWhenLessThanAuditLevel" field when audit enabled is equal false', async () => {
    const updateSpy = mockUpdateInstanceRequest();

    renderWithThemeAndRouter(<UpdateDataSource />, undefined);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByTitle(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )?.parentElement?.parentElement?.parentElement
    ).not.toHaveClass('ant-form-item-hidden');

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );
    expect(
      screen.getByTitle(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )?.parentElement?.parentElement?.parentElement
    ).toHaveClass('ant-form-item-hidden');

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      additional_params: [
        {
          name: 'a',
          value: '123',
        },
        {
          name: 'b',
          value: '123',
        },
        {
          name: 'c',
          value: 'true',
        },
      ],
      db_host: '20.20.20.2',
      db_port: '3306',
      db_user: 'root',
      db_type: 'mysql',
      desc: '',
      instance_name: 'db1',
      project_name: 'default',

      rule_template_name: 'default_MySQL',
      maintenance_times: [
        {
          maintenance_start_time: {
            hour: 23,
            minute: 0,
          },
          maintenance_stop_time: {
            hour: 23,
            minute: 30,
          },
        },
        {
          maintenance_start_time: {
            hour: 0,
            minute: 0,
          },
          maintenance_stop_time: {
            hour: 2,
            minute: 0,
          },
        },
      ],
      sql_query_config: {
        allow_query_when_less_than_audit_level: undefined,
        audit_enabled: false,
      },
    });

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );

    expect(
      getSelectValueByFormLabel(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )
    ).toHaveTextContent('notice');
  });
});
