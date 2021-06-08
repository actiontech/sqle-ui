import { fireEvent, waitFor, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import { act } from 'react-dom/test-utils';
import SqlInfoForm, { SQLInputType } from '.';
import instance from '../../../../api/instance';
import EmitterKey from '../../../../data/EmitterKey';
import { renderWithTheme } from '../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseInstanceSchema,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../theme';
import EventEmitter from '../../../../utils/EventEmitter';

describe('order/create/sqlInfoForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { theme: SupportTheme.LIGHT } });
    mockUseDispatch();
    mockUseInstance();
    mockUseInstanceSchema();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockCheckInstanceConnect = () => {
    const spy = jest.spyOn(instance, 'checkInstanceIsConnectableByNameV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        is_instance_connectable: true,
      })
    );
    return spy;
  };

  test('should call submit of props when user click audit button', async () => {
    const { result } = renderHook(() => useForm());
    const checkInstanceConnectSpy = mockCheckInstanceConnect();
    const submitMock = jest.fn();
    const updateDirtyDataMock = jest.fn();
    submitMock.mockImplementation(() => resolveThreeSecond({}));
    renderWithTheme(
      <SqlInfoForm
        form={result.current[0]}
        submit={submitMock}
        updateDirtyData={updateDirtyDataMock}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(6000);
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceSchema'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const schemaOptions = screen.getAllByText('schema1');
    const schema = schemaOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schema);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
    );
    expect(checkInstanceConnectSpy).toBeCalledTimes(1);
    expect(checkInstanceConnectSpy).toBeCalledWith({
      instance_name: 'instance1',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
        .parentNode
    ).toHaveClass('ant-btn-loading');
    // expect(
    //   screen.getByText('dataSource.dataSourceForm.testing')
    // ).toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
        .parentNode
    ).not.toHaveClass('ant-btn-loading');
    expect(
      screen.getByText('dataSource.dataSourceForm.testSuccess')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('order.sqlInfo.audit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

    expect(submitMock).toBeCalledTimes(1);
    expect(submitMock).toBeCalledWith({
      instanceName: 'instance1',
      instanceSchema: 'schema1',
      sql: 'select * from table2',
      sqlInputType: SQLInputType.manualInput,
    });
    expect(updateDirtyDataMock).toBeCalledTimes(0);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('order.sqlInfo.audit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(updateDirtyDataMock).toBeCalledTimes(1);
    expect(updateDirtyDataMock).toBeCalledWith(false);
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });
    expect(updateDirtyDataMock).toBeCalledTimes(2);
    expect(updateDirtyDataMock).toBeCalledWith(true);

    act(() => {
      EventEmitter.emit(EmitterKey.Reset_Create_Order_Form);
    });

    expect(
      screen.queryByText('dataSource.dataSourceForm.testSuccess')
    ).not.toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });
    expect(updateDirtyDataMock).toBeCalledTimes(2);
  });

  test('should upload file when user select upload sql file', async () => {
    const { result } = renderHook(() => useForm());
    const submitMock = jest.fn();
    const updateDirtyDataMock = jest.fn();
    submitMock.mockImplementation(() => resolveThreeSecond({}));
    renderWithTheme(
      <SqlInfoForm
        form={result.current[0]}
        submit={submitMock}
        updateDirtyData={updateDirtyDataMock}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(6000);
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByText('order.sqlInfo.uploadFile'));
    const sqlFile = new File(
      [new Blob(['select * from table_test'], { type: 'text/plain' })],
      'test.sql'
    );
    fireEvent.change(screen.getByLabelText('order.sqlInfo.sqlFile'), {
      target: { files: [sqlFile] },
    });

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('order.sqlInfo.audit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

    expect(submitMock).toBeCalledTimes(1);
    expect(submitMock).toBeCalledWith({
      instanceName: 'instance1',
      instanceSchema: undefined,
      sqlInputType: SQLInputType.uploadFile,
      sqlFile: [sqlFile],
    });
  });

  test('should upload mybatis file when user select upload mybits file', async () => {
    const { result } = renderHook(() => useForm());
    const submitMock = jest.fn();
    const updateDirtyDataMock = jest.fn();
    submitMock.mockImplementation(() => resolveThreeSecond({}));
    renderWithTheme(
      <SqlInfoForm
        form={result.current[0]}
        submit={submitMock}
        updateDirtyData={updateDirtyDataMock}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(6000);
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByText('order.sqlInfo.updateMybatisFile'));

    const mybatisFile = new File(
      [
        new Blob(
          [
            '<mapper namespace="com.mybatis.test.User"><select>select * from table1 where id = #{id}</select></mapper>',
          ],
          {
            type: 'text/plain',
          }
        ),
      ],
      'mybatis.xml'
    );
    const mybatisFileElement = screen.getAllByLabelText(
      'order.sqlInfo.updateMybatisFile'
    )[1];
    expect(mybatisFileElement).toHaveAttribute('type', 'file');
    fireEvent.change(mybatisFileElement, {
      target: { files: [mybatisFile] },
    });

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('order.sqlInfo.audit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

    expect(submitMock).toBeCalledTimes(1);
    expect(submitMock).toBeCalledWith({
      instanceName: 'instance1',
      instanceSchema: undefined,
      sqlInputType: SQLInputType.uploadMybatisFile,
      mybatisFile: [mybatisFile],
    });
  });
});
