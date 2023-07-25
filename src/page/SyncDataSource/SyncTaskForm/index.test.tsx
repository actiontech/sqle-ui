import { fireEvent, render, screen, act } from '@testing-library/react';
import { useForm } from 'antd/lib/form/Form';
import SyncTaskForm from '.';
import { IInstanceTaskDetailResV1 } from '../../../api/common';
import {
  selectCustomOptionByClassName,
  selectOptionByIndex,
} from '../../../testUtils/customQuery';
import {
  mockUseGlobalRuleTemplate,
  mockUseTaskSource,
} from '../../../testUtils/mockRequest';
import { renderHook } from '@testing-library/react-hooks';

const defaultSyncTask: IInstanceTaskDetailResV1 = {
  db_type: 'mysql',
  id: 0,
  source: 'source1',
  url: 'http://192.168.1.1:3000',
  version: '4.2.2.0',
  sync_instance_interval: '0 0 * * *',
  rule_template: 'global_rule_template_name1',
};

const mockSubmit = jest.fn();
const renderComponent = async (defaultValue?: IInstanceTaskDetailResV1) => {
  const { result } = renderHook(() => useForm());
  return await act(async () =>
    render(
      <SyncTaskForm
        form={result.current[0]}
        submit={mockSubmit}
        defaultValue={defaultValue}
      />
    )
  );
};

describe('test SyncTaskForm', () => {
  let getGlobalRuleTemplateSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseTaskSource();
    getGlobalRuleTemplateSpy = mockUseGlobalRuleTemplate();
    mockSubmit.mockImplementation(
      () =>
        new Promise((res) => {
          setTimeout(() => {
            res(null);
          }, 3000);
        })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  test('should match snapshot', async () => {
    const { container } = await renderComponent();
    expect(container).toMatchSnapshot();
  });

  test('should be call submit when clicking submit button', async () => {
    await renderComponent();
    expect(mockSubmit).toBeCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('syncDataSource.syncTaskForm.source', 'source1');
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.change(
      screen.getByLabelText('syncDataSource.syncTaskForm.version'),
      { target: { value: '4.22.0' } }
    );
    fireEvent.change(screen.getByLabelText('syncDataSource.syncTaskForm.url'), {
      target: { value: 'http://192.168.0.1:3000' },
    });

    selectCustomOptionByClassName(
      'syncDataSource.syncTaskForm.instanceType',
      'database-type-logo-wrapper',
      0
    );
    await act(async () => jest.advanceTimersByTime(0));

    selectOptionByIndex(
      'syncDataSource.syncTaskForm.ruleTemplateName',
      'global_rule_template_name1'
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith({
      instanceType: 'mysql',
      ruleTemplateName: 'global_rule_template_name1',
      source: 'source1',
      syncInterval: '0 0 * * *',
      url: 'http://192.168.0.1:3000',
      version: '4.22.0',
    });
    expect(screen.getByText('common.submit').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.reset').closest('button')).toBeDisabled();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.submit').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(
      screen.getByText('common.reset').closest('button')
    ).not.toBeDisabled();
  });

  test('should reset fields when clicking reset button', async () => {
    await renderComponent();
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.change(
      screen.getByLabelText('syncDataSource.syncTaskForm.version'),
      { target: { value: '4.22.0' } }
    );
    fireEvent.change(screen.getByLabelText('syncDataSource.syncTaskForm.url'), {
      target: { value: 'http://192.168.0.1:3000' },
    });

    fireEvent.click(screen.getByText('common.reset'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByLabelText('syncDataSource.syncTaskForm.version')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('syncDataSource.syncTaskForm.url')
    ).toHaveValue('');
  });

  test('should set default value when defaultValue is not undefined', async () => {
    const { container } = await renderComponent(defaultSyncTask);
    expect(getGlobalRuleTemplateSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.reset'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getGlobalRuleTemplateSpy).toBeCalledTimes(2);
    expect(container).toMatchSnapshot();
  });

  test('should empty rule template name when changing database type', async () => {
    await renderComponent();

    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('syncDataSource.syncTaskForm.source', 'source1');
    await act(async () => jest.advanceTimersByTime(0));

    selectCustomOptionByClassName(
      'syncDataSource.syncTaskForm.instanceType',
      'database-type-logo-wrapper',
      0
    );
    expect(screen.getAllByText('mysql')[0].parentNode?.parentNode).toHaveClass(
      'ant-select-selection-item'
    );

    await act(async () => jest.advanceTimersByTime(0));

    selectOptionByIndex(
      'syncDataSource.syncTaskForm.ruleTemplateName',
      'global_rule_template_name1'
    );
    expect(screen.getAllByText('global_rule_template_name1')[0]).toHaveClass(
      'ant-select-selection-item'
    );
    await act(async () => jest.advanceTimersByTime(0));

    selectOptionByIndex('syncDataSource.syncTaskForm.source', 'source2');
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getAllByText('mysql')[0]).not.toHaveClass(
      'ant-select-selection-item'
    );

    selectCustomOptionByClassName(
      'syncDataSource.syncTaskForm.instanceType',
      'database-type-logo-wrapper',
      0
    );

    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getAllByText('global_rule_template_name1')[0]
    ).not.toHaveClass('ant-select-selection-item');
  });
});
