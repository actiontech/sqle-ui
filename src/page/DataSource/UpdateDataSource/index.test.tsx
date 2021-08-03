import { fireEvent, waitFor, screen } from '@testing-library/react';
import UpdateDataSource from '.';
import instance from '../../../api/instance';
import {
  renderWithThemeAndRouter,
  renderWithThemeAndServerRouter,
} from '../../../testUtils/customRender';
import {
  mockUseRole,
  mockUseRuleTemplate,
  mockUseWorkflowTemplate,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { useParams } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { mockDriver } from '../../../testUtils/mockRequest';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

describe('UpdateDataSource', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ instanceName: '1' });
    mockUseRuleTemplate();
    mockUseRole();
    mockGetInstance();
    mockUseWorkflowTemplate();
    mockDriver();
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

  const mockGetInstance = () => {
    const spy = jest.spyOn(instance, 'getInstanceV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        instance_name: 'db1',
        db_host: '20.20.20.2',
        db_port: '3306',
        db_user: 'root',
        db_type: 'mysql',
        desc: '',
        workflow_template_name: 'workflow-template-name-1',
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

    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.type')
    );
    const mysqlDatabaseTypeOption = screen.getAllByText('mysql')[2];
    expect(mysqlDatabaseTypeOption).toHaveClass(
      'ant-select-item-option-content'
    );
    fireEvent.click(mysqlDatabaseTypeOption);

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
      screen.getByLabelText('dataSource.dataSourceForm.role')
    );

    await screen.findAllByText('role_name1');
    const allRoleOptions = screen.getAllByText('role_name1');
    const roleOption = allRoleOptions[1];
    expect(roleOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(roleOption);

    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.ruleTemplate')
    );
    await screen.findAllByText('rule_template_name1');
    const allInstanceOptions = screen.getAllByText('rule_template_name1');
    const instanceOption = allInstanceOptions[1];
    expect(instanceOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instanceOption);

    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.workflow')
    );
    expect(screen.getAllByText('workflow-template-name-1')[2]).toHaveClass(
      'ant-select-item-option-content'
    );
    fireEvent.click(screen.getAllByText('workflow-template-name-1')[2]);

    await waitFor(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      db_host: '1.1.1.1',
      db_password: '123456',
      db_port: '4444',
      db_user: 'root',
      db_type: 'mysql',
      desc: 'desc1',
      instance_name: 'instance_name1',
      role_name_list: ['role_name1'],
      rule_template_name_list: ['rule_template_name1'],
      workflow_template_name: 'workflow-template-name-1',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('dataSource.updateDatabase.updateDatabaseSuccess')
    ).not.toBeNull();

    expect(history.location.pathname).toBe('/data');
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
