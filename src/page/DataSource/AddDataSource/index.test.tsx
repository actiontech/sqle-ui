import { fireEvent, waitFor, screen } from '@testing-library/react';
import AddDataSource from '.';
import instance from '../../../api/instance';
import EmitterKey from '../../../data/EmitterKey';
import { getBySelector } from '../../../testUtils/customQuery';
import {
  renderWithTheme,
  renderWithThemeAndRouter,
} from '../../../testUtils/customRender';
import {
  mockUseRole,
  mockUseRuleTemplate,
  mockUseWorkflowTemplate,
  mockDriver,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';

describe('AddDataSource', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseRuleTemplate();
    mockUseRole();
    mockUseWorkflowTemplate();
    mockDriver();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockCreateInstanceRequest = () => {
    const spy = jest.spyOn(instance, 'createInstanceV1');
    spy.mockImplementation(() => resolveThreeSecond(undefined));
    return spy;
  };

  const mockEventEmit = () => {
    const spy = jest.spyOn(EventEmitter, 'emit');
    return spy;
  };

  test('should render data source form', () => {
    const { container } = renderWithTheme(<AddDataSource />);
    expect(container).toMatchSnapshot();
  });

  test('should send create instance request when click submit', async () => {
    const create = mockCreateInstanceRequest();
    renderWithThemeAndRouter(<AddDataSource />);

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
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const databaseTypeOption = screen.getAllByText('mysql')[1];
    expect(databaseTypeOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(databaseTypeOption);

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
    await screen.findAllByText('workflow-template-name-1');
    const allWorkflowOptions = screen.getAllByText('workflow-template-name-1');
    const workflowOption = allWorkflowOptions[1];
    expect(workflowOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(workflowOption);

    await waitFor(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });

    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith({
      db_type: 'mysql',
      db_host: '1.1.1.1',
      db_password: '123456',
      db_port: '4444',
      db_user: 'root',
      desc: 'desc1',
      instance_name: 'instance_name1',
      role_name_list: ['role_name1'],
      rule_template_name_list: ['rule_template_name1'],
      workflow_template_name: 'workflow-template-name-1',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    const emit = mockEventEmit();
    expect(screen.getByText('dataSource.addDatabaseSuccess')).not.toBeNull();

    fireEvent.click(screen.getByText('common.resetAndClose'));

    expect(screen.getByLabelText('dataSource.dataSourceForm.name')).toHaveValue(
      ''
    );
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
    expect(emit).toBeCalledTimes(1);
    expect(emit).toBeCalledWith(EmitterKey.Reset_Test_Data_Source_Connect);
  });

  test('should reset all fields when click reset button', async () => {
    renderWithTheme(<AddDataSource />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.name'), {
      target: { value: 'instance_name1' },
    });
    expect(screen.getByLabelText('dataSource.dataSourceForm.name')).toHaveValue(
      'instance_name1'
    );

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.port'), {
      target: { value: 4444 },
    });
    expect(screen.getByLabelText('dataSource.dataSourceForm.port')).toHaveValue(
      '4444'
    );

    fireEvent.click(screen.getByText('common.reset'));

    expect(screen.getByLabelText('dataSource.dataSourceForm.name')).toHaveValue(
      ''
    );
    expect(screen.getByLabelText('dataSource.dataSourceForm.port')).toHaveValue(
      '3306'
    );
  });
});
