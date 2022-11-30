import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks/dom';
import Form, { useForm } from 'antd/lib/form/Form';
import { getInstanceTipListV1FunctionalModuleEnum } from '../../../../../api/instance/index.enum';
import {
  mockInstanceTip,
  mockUseInstanceSchema,
} from '../../../../../testUtils/mockRequest';
import DatabaseInfo from '../DatabaseInfo';

const selectOptionByIndex = (
  label: string,
  optionText: string,
  index = 1,
  labelIndex = 0
) => {
  fireEvent.mouseDown(screen.getAllByLabelText(label)[labelIndex]);
  const options = screen.getAllByText(optionText);
  let realIndex = index;
  if (index < 0) {
    realIndex = options.length + index;
  }
  const option = options[realIndex];
  expect(option).toHaveClass('ant-select-item-option-content');
  fireEvent.click(option);
};

describe('test Order/Create/SqlInfoForm/DatabaseInfo', () => {
  const instanceNameChange = jest.fn();
  const setInstanceNames = jest.fn();
  const setChangeSqlModeDisabled = jest.fn();
  const clearTaskInfoWithKey = jest.fn();
  const projectName = 'default';
  let getInstanceListSpy: jest.SpyInstance;
  let getInstanceSchemaSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getInstanceListSpy = mockInstanceTip();
    getInstanceSchemaSpy = mockUseInstanceSchema();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const renderComponent = () => {
    const { result } = renderHook(() => useForm());
    return render(
      <Form form={result.current[0]}>
        <DatabaseInfo
          form={result.current[0]}
          instanceNameChange={instanceNameChange}
          setChangeSqlModeDisabled={setChangeSqlModeDisabled}
          setInstanceNames={setInstanceNames}
          clearTaskInfoWithKey={clearTaskInfoWithKey}
          projectName={projectName}
        />
      </Form>
    );
  };

  test('should match snapshot', async () => {
    const { container } = renderComponent();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });

  test('should be able to add and remove items', async () => {
    expect(getInstanceListSpy).toBeCalledTimes(0);
    expect(getInstanceSchemaSpy).toBeCalledTimes(0);

    renderComponent();

    expect(instanceNameChange).toBeCalledTimes(0);
    expect(setChangeSqlModeDisabled).toBeCalledTimes(0);
    expect(setInstanceNames).toBeCalledTimes(0);
    expect(clearTaskInfoWithKey).toBeCalledTimes(0);

    expect(getInstanceListSpy).toBeCalledTimes(1);
    expect(getInstanceListSpy).toBeCalledWith({
      project_name: projectName,
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow,
    });
    expect(getInstanceSchemaSpy).toBeCalledTimes(0);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryAllByLabelText('order.sqlInfo.instanceName').length
    ).toBe(1);
    expect(
      screen.queryAllByLabelText('order.sqlInfo.instanceSchema').length
    ).toBe(1);
    expect(
      screen.queryAllByLabelText('order.sqlInfo.instanceSchema')[0]
    ).toBeDisabled();
    expect(screen.queryByTestId('remove-item')).not.toBeInTheDocument();

    selectOptionByIndex('order.sqlInfo.instanceName', 'mysql-test');
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(setInstanceNames).toBeCalledTimes(1);
    expect(setInstanceNames.mock.calls[0][0](new Map([[0, '']]))).toEqual(
      new Map([[0, 'mysql-test']])
    );

    expect(instanceNameChange).toBeCalledTimes(1);
    expect(instanceNameChange).toBeCalledWith('mysql-test');

    expect(setChangeSqlModeDisabled).toBeCalledTimes(1);
    expect(setChangeSqlModeDisabled).toBeCalledWith(false);

    expect(getInstanceSchemaSpy).toBeCalledTimes(1);
    expect(getInstanceSchemaSpy).toBeCalledWith({
      instance_name: 'mysql-test',
      project_name: projectName,
    });

    expect(
      screen.queryAllByLabelText('order.sqlInfo.instanceSchema')[0]
    ).not.toBeDisabled();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    selectOptionByIndex('order.sqlInfo.instanceSchema', 'schema1');
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    //add
    fireEvent.click(screen.getByText('order.sqlInfo.addInstance'));

    expect(setInstanceNames).toBeCalledTimes(2);
    expect(
      setInstanceNames.mock.calls[1][0](new Map([[0, 'mysql-test']]))
    ).toEqual(
      new Map([
        [0, 'mysql-test'],
        [1, ''],
      ])
    );

    expect(
      screen.queryAllByLabelText('order.sqlInfo.instanceName').length
    ).toBe(2);
    expect(
      screen.queryAllByLabelText('order.sqlInfo.instanceSchema').length
    ).toBe(2);
    expect(screen.queryByTestId('remove-item')).toBeInTheDocument();

    selectOptionByIndex('order.sqlInfo.instanceName', 'mysql-test', 4, 1);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(setInstanceNames).toBeCalledTimes(3);
    expect(
      setInstanceNames.mock.calls[2][0](
        new Map([
          [0, 'mysql-test'],
          [1, ''],
        ])
      )
    ).toEqual(
      new Map([
        [0, 'mysql-test'],
        [1, 'mysql-test'],
      ])
    );

    expect(instanceNameChange).toBeCalledTimes(2);

    expect(setChangeSqlModeDisabled).toBeCalledTimes(2);
    expect(setChangeSqlModeDisabled).toBeCalledWith(false);

    expect(getInstanceSchemaSpy).toBeCalledTimes(2);
    expect(getInstanceSchemaSpy).toBeCalledWith({
      instance_name: 'mysql-test',
      project_name: projectName,
    });

    //remove
    fireEvent.click(screen.getByTestId('remove-item'));

    expect(
      screen.queryAllByLabelText('order.sqlInfo.instanceName').length
    ).toBe(1);
    expect(
      screen.queryAllByLabelText('order.sqlInfo.instanceSchema').length
    ).toBe(1);
    expect(screen.queryByTestId('remove-item')).not.toBeInTheDocument();

    expect(setInstanceNames).toBeCalledTimes(4);
    expect(
      setInstanceNames.mock.calls[3][0](
        new Map([
          [0, 'mysql-test'],
          [1, 'mysql-test'],
        ])
      )
    ).toEqual(new Map([[0, 'mysql-test']]));

    expect(setChangeSqlModeDisabled).toBeCalledTimes(3);
    expect(setChangeSqlModeDisabled).toBeCalledWith(false);

    expect(clearTaskInfoWithKey).toBeCalledTimes(1);
    expect(clearTaskInfoWithKey).toBeCalledWith('1');

    //add
    fireEvent.click(screen.getByText('order.sqlInfo.addInstance'));

    expect(setInstanceNames).toBeCalledTimes(5);
    expect(
      setInstanceNames.mock.calls[4][0](new Map([[0, 'mysql-test']]))
    ).toEqual(
      new Map([
        [0, 'mysql-test'],
        [1, ''],
      ])
    );

    selectOptionByIndex('order.sqlInfo.instanceName', 'oracle-test', 1, 1);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(setInstanceNames).toBeCalledTimes(6);
    expect(
      setInstanceNames.mock.calls[5][0](
        new Map([
          [0, 'mysql-test'],
          [1, ''],
        ])
      )
    ).toEqual(
      new Map([
        [0, 'mysql-test'],
        [1, ''],
        [2, 'oracle-test'],
      ])
    );

    expect(instanceNameChange).toBeCalledTimes(3);

    expect(setChangeSqlModeDisabled).toBeCalledTimes(4);
    expect(setChangeSqlModeDisabled).toBeCalledWith(true);

    expect(getInstanceSchemaSpy).toBeCalledTimes(3);
    expect(getInstanceSchemaSpy).toBeCalledWith({
      instance_name: 'oracle-test',
      project_name: projectName,
    });

    //remove
    fireEvent.click(screen.getByTestId('remove-item'));

    expect(setInstanceNames).toBeCalledTimes(7);
    expect(
      setInstanceNames.mock.calls[6][0](
        new Map([
          [0, 'mysql-test'],
          [1, ''],
          [2, 'oracle-test'],
        ])
      )
    ).toEqual(
      new Map([
        [0, 'mysql-test'],
        [1, ''],
      ])
    );

    expect(setChangeSqlModeDisabled).toBeCalledTimes(5);
    expect(setChangeSqlModeDisabled).toBeCalledWith(false);

    expect(clearTaskInfoWithKey).toBeCalledTimes(2);
    expect(clearTaskInfoWithKey).toBeCalledWith('2');
  });
});
