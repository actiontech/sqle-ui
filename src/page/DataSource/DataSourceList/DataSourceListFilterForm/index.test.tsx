import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isEqual } from 'lodash';
import DataSourceListFilterForm from '.';
import {
  mockUseInstance,
  mockUseRole,
  mockUseRuleTemplate,
  mockDriver,
} from '../../../../testUtils/mockRequest';

describe.skip('DataSource/DataSourceList/DataSourceListFilterForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseInstance();
    mockUseRuleTemplate();
    mockUseRole();
    mockDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { container } = render(
      <DataSourceListFilterForm submit={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should submit filter info when user click search button', async () => {
    const submitFn = jest.fn();
    render(<DataSourceListFilterForm submit={submitFn} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.name')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const option = screen.getAllByText('instance1')[1];
    fireEvent.click(option);
    fireEvent.click(screen.getByText('common.search'));

    expect(submitFn).toBeCalledTimes(1);
    expect(submitFn).toBeCalledWith({
      filter_instance_name: 'instance1',
    });

    fireEvent.click(screen.getByText('common.reset'));
    expect(submitFn).toBeCalledTimes(2);
    expect(submitFn).toBeCalledWith({});
  });

  test('should reset all filter info when user click reset button', async () => {
    const submitFn = jest.fn();
    render(<DataSourceListFilterForm submit={submitFn} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.name')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const option = screen.getAllByText('instance1')[1];
    fireEvent.click(option);
    fireEvent.click(screen.getByText('common.search'));

    expect(submitFn).toBeCalledTimes(1);
    expect(submitFn).toBeCalledWith({
      filter_instance_name: 'instance1',
    });
  });

  test('should reset a part of fields when user collapse filter', async () => {
    const submitFn = jest.fn();
    render(<DataSourceListFilterForm submit={submitFn} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.collapse')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('common.expansion'));
    expect(screen.queryByText('common.expansion')).not.toBeInTheDocument();

    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.ruleTemplate')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const option = screen.getAllByText('rule_template_name1')[1];
    fireEvent.click(option);

    fireEvent.click(screen.getByText('common.collapse'));
    expect(screen.queryByText('common.expansion')).toBeInTheDocument();

    expect(submitFn).toBeCalledTimes(1);
    expect(
      isEqual(submitFn.mock.calls[0][0], {
        filter_instance_name: undefined,
        filter_db_host: undefined,
        filter_db_port: undefined,
        filter_db_user: undefined,
        filter_rule_template_name: undefined,
        filter_role_name: undefined,
        filter_db_type: undefined,
      })
    ).toBe(true);
  });
});
