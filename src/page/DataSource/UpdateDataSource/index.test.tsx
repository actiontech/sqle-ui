import { fireEvent, waitFor, screen } from '@testing-library/react';
import UpdateDataSource from '.';
import instance from '../../../api/instance';
import {
  renderWithThemeAndRouter,
  renderWithThemeAndServerRouter,
} from '../../../testUtils/customRender';
import {
  mockUseGlobalRuleTemplate,
  mockUseRuleTemplate,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { useParams } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { mockDriver } from '../../../testUtils/mockRequest';
import { dataSourceMetas } from '../__testData__';
import { getBySelector } from '../../../testUtils/customQuery';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});
const projectName = 'default';

describe('UpdateDataSource', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ instanceName: '1', projectName });
    mockUseRuleTemplate();
    mockGetInstance();
    mockDriver();
    mockGetDataSourceMetas();
    mockUseGlobalRuleTemplate();
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
    spy.mockImplementation(() =>
      resolveThreeSecond({
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
        workflow_template_name: 'workflow-template-name-1',
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
          max_pre_query_rows: 50,
          query_timeout_second: 10000,
          allow_query_when_less_than_audit_level: 'notice',
          audit_enabled: true,
        },
      })
    );
    return spy;
  };

  test('should render data source form', async () => {
    const { container } = renderWithThemeAndRouter(
      <UpdateDataSource />,
      undefined
    );
    expect(container).toMatchSnapshot();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should send update instance request when click submit', async () => {
    const updateSpy = mockUpdateInstanceRequest();
    const history = createMemoryHistory();
    history.push('/data/update/db1');
    renderWithThemeAndServerRouter(<UpdateDataSource />, undefined, {
      history,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.name'), {
      target: { value: 'instance_name1' },
    });
    fireEvent.input(
      screen.getByLabelText('dataSource.dataSourceForm.describe'),
      {
        target: { value: 'desc1' },
      }
    );

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

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );

    fireEvent.click(screen.getByText('common.add'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(getBySelector('.ant-picker-range'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getAllByText('04')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getAllByText('05')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.ok'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });

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
        max_pre_query_rows: 50,
        query_timeout_second: 10000,
        allow_query_when_less_than_audit_level: 'error',
        audit_enabled: true,
      },
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('dataSource.updateDatabase.updateDatabaseSuccess')
    ).not.toBeNull();

    expect(history.location.pathname).toBe(`/project/${projectName}/data`);
  });

  // test('should reset all fields when click reset button', async () => {
  //   renderWithTheme(<UpdateDataSource />);

  //   await waitFor(() => {
  //     jest.advanceTimersByTime(3000);
  //   });

  //   fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.name'), {
  //     target: { value: 'instance_name1' },
  //   });
  //   expect(screen.getByLabelText('dataSource.dataSourceForm.name')).toHaveValue(
  //     'instance_name1'
  //   );

  //   fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.port'), {
  //     target: { value: 4444 },
  //   });
  //   expect(screen.getByLabelText('dataSource.dataSourceForm.port')).toHaveValue(
  //     '4444'
  //   );

  //   fireEvent.click(screen.getByText('common.reset'));

  //   expect(screen.getByLabelText('dataSource.dataSourceForm.name')).toHaveValue(
  //     ''
  //   );
  //   expect(screen.getByLabelText('dataSource.dataSourceForm.port')).toHaveValue(
  //     '3306'
  //   );
  // });
});
