/* eslint-disable no-console */
import { fireEvent, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import { act } from 'react-dom/test-utils';
import SqlInfoForm from '..';
import instance from '../../../../../api/instance';
import EmitterKey from '../../../../../data/EmitterKey';
import { renderWithThemeAndRouter } from '../../../../../testUtils/customRender';

import {
  mockUseInstance,
  mockUseInstanceSchema,
  resolveThreeSecond,
  mockDriver,
} from '../../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../../theme';
import EventEmitter from '../../../../../utils/EventEmitter';
import { SQLInputType } from '../../index.enum';
import { SqlInfoFormFields, SqlInfoFormProps } from '../index.type';
import { useDispatch, useSelector } from 'react-redux';
import * as sqlFormatter from '../../../../../utils/FormatterSQL';
import { selectOptionByIndex } from '../../../../../testUtils/customQuery';
import { mockGetInstance } from './common';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

jest.mock('../../../../../utils/FormatterSQL', () => {
  return {
    ...jest.requireActual('../../../../../utils/FormatterSQL'),
    formatterSQL: jest.fn(),
  };
});

describe('order/create/sqlInfoForm', () => {
  const mockSubmit = jest.fn();
  const projectName = 'default';
  const updateDirtyDataMock = jest.fn();
  const clearTaskInfos = jest.fn();
  const clearTaskInfoWithKey = jest.fn();
  let checkInstanceConnectSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let getInstanceSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
      })
    );
    mockUseInstance();
    mockUseInstanceSchema();
    mockDriver();
    getInstanceSpy = mockGetInstance();
    checkInstanceConnectSpy = mockCheckInstanceConnect();
    mockSubmit.mockImplementation(() => resolveThreeSecond({}));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const error = console.error;
  beforeAll(() => {
    console.error = jest.fn((message: any) => {
      if (
        message.includes(
          'A component is changing an uncontrolled input to be controlled'
        )
      ) {
        return;
      }
      error(message);
    });
  });

  afterAll(() => {
    console.error = error;
  });

  const mockCheckInstanceConnect = () => {
    const spy = jest.spyOn(instance, 'batchCheckInstanceIsConnectableByName');
    spy.mockImplementation(() =>
      resolveThreeSecond([
        {
          is_instance_connectable: true,
        },
      ])
    );
    return spy;
  };

  const renderComponent = (props?: SqlInfoFormProps) => {
    const { result } = renderHook(() => useForm<SqlInfoFormFields>());
    return renderWithThemeAndRouter(
      <SqlInfoForm
        form={result.current[0]}
        submit={mockSubmit}
        updateDirtyData={updateDirtyDataMock}
        clearTaskInfos={clearTaskInfos}
        clearTaskInfoWithKey={clearTaskInfoWithKey}
        projectName={projectName}
        {...props}
      />
    );
  };

  test('should match snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  test('should call submit of props when user click audit button', async () => {
    renderComponent();

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      screen.getAllByLabelText('order.sqlInfo.instanceName')[0]
    );
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions1 = screen.getAllByText('instance1');
    const instance1 = instanceOptions1[1];
    expect(instance1).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      screen.getAllByLabelText('order.sqlInfo.instanceSchema')[0]
    );

    await act(async () => jest.advanceTimersByTime(0));

    const schemaOptions1 = screen.getAllByText('schema1');
    const schema1 = schemaOptions1[1];
    expect(schema1).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schema1);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
    );
    expect(checkInstanceConnectSpy).toBeCalledTimes(1);
    expect(checkInstanceConnectSpy).toBeCalledWith({
      project_name: projectName,
      instances: [
        {
          name: 'instance1',
        },
      ],
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
        .parentNode
    ).toHaveClass('ant-btn-loading');
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
        .parentNode
    ).not.toHaveClass('ant-btn-loading');
    expect(
      screen.getByText('dataSource.dataSourceForm.testSuccess')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    expect(screen.getByText('order.sqlInfo.audit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

    await act(async () => jest.advanceTimersByTime(0));

    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith(
      {
        '0': {
          sql: 'select * from table2',
          sqlInputType: SQLInputType.manualInput,
        },
        dataBaseInfo: [
          {
            instanceName: 'instance1',
            instanceSchema: 'schema1',
          },
        ],
        isSameSqlOrder: true,
      },
      0,
      ''
    );
    expect(updateDirtyDataMock).toBeCalledTimes(0);
    await act(async () => jest.advanceTimersByTime(3000));

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

    //different sql mode
    fireEvent.click(screen.getByLabelText('order.sqlInfo.isSameSqlOrder'));
    expect(updateDirtyDataMock).toBeCalledTimes(3);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table5' },
    });
    expect(updateDirtyDataMock).toBeCalledTimes(4);

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    expect(screen.getByText('order.sqlInfo.audit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

    await act(async () => jest.advanceTimersByTime(0));

    expect(mockSubmit).toBeCalledTimes(2);
    expect(mockSubmit).toBeCalledWith(
      {
        '0': {
          sql: 'select * from table5',
          sqlInputType: SQLInputType.manualInput,
        },
        dataBaseInfo: [
          {
            instanceName: 'instance1',
            instanceSchema: 'schema1',
          },
        ],
        isSameSqlOrder: false,
      },
      0,
      '0'
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateDirtyDataMock).toBeCalledTimes(5);

    await act(() => {
      EventEmitter.emit(EmitterKey.Reset_Create_Order_Form);
    });

    expect(
      screen.queryByText('dataSource.dataSourceForm.testSuccess')
    ).not.toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateDirtyDataMock).toBeCalledTimes(5);
  });

  test('should upload file when user select upload sql file', async () => {
    renderComponent();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.sqlInfo.uploadFile'));
    const sqlFile = new File(
      [new Blob(['select * from table_test'], { type: 'text/plain' })],
      'test.sql'
    );
    fireEvent.change(screen.getByLabelText('order.sqlInfo.sqlFile'), {
      target: { files: [sqlFile] },
    });

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('order.sqlInfo.audit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith(
      {
        '0': {
          sqlFile: [sqlFile],
          sqlInputType: SQLInputType.uploadFile,
        },
        dataBaseInfo: [
          {
            instanceName: 'instance1',
          },
        ],
        isSameSqlOrder: true,
      },
      0,
      ''
    );
  });

  test('should upload mybatis file when user select upload mybits file', async () => {
    renderComponent();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.sqlInfo.uploadMybatisFile'));

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
    const mybatisFileElement = screen.getByLabelText(
      'order.sqlInfo.mybatisFile'
    );
    expect(mybatisFileElement).toHaveAttribute('type', 'file');
    fireEvent.change(mybatisFileElement, {
      target: { files: [mybatisFile] },
    });

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('order.sqlInfo.audit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith(
      {
        '0': {
          mybatisFile: [mybatisFile],
          sqlInputType: SQLInputType.uploadMybatisFile,
        },
        dataBaseInfo: [
          {
            instanceName: 'instance1',
          },
        ],
        isSameSqlOrder: true,
      },
      0,
      ''
    );
  });

  test('should render error message when test connect button was wrong', async () => {
    renderComponent();

    checkInstanceConnectSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          is_instance_connectable: false,
          connect_error_message: 'error message',
        },
      ])
    );

    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      screen.getAllByLabelText('order.sqlInfo.instanceName')[0]
    );
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions1 = screen.getAllByText('instance1');
    const instance1 = instanceOptions1[1];
    expect(instance1).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      screen.getAllByLabelText('order.sqlInfo.instanceSchema')[0]
    );

    await act(async () => jest.advanceTimersByTime(0));

    const schemaOptions1 = screen.getAllByText('schema1');
    const schema1 = schemaOptions1[1];
    expect(schema1).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schema1);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
    );
    expect(checkInstanceConnectSpy).toBeCalledTimes(1);
    expect(checkInstanceConnectSpy).toBeCalledWith({
      project_name: projectName,
      instances: [
        {
          name: 'instance1',
        },
      ],
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
        .parentNode
    ).toHaveClass('ant-btn-loading');
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
        .parentNode
    ).not.toHaveClass('ant-btn-loading');
    expect(
      screen.queryByText('dataSource.dataSourceForm.testSuccess')
    ).not.toBeInTheDocument();

    expect(
      screen.getByText('dataSource.dataSourceForm.testFailed')
    ).toBeInTheDocument();
  });

  test('should format sql when clicked format button', async () => {
    const mockSqlFormatter = sqlFormatter.formatterSQL as jest.Mock;
    mockSqlFormatter.mockReturnValueOnce('SELECT * FROM table3;');

    renderComponent();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    //same sql mode
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('order.sqlInfo.format'));
    });
    expect(getInstanceSpy).toBeCalledTimes(0);

    expect(mockSqlFormatter).toBeCalledTimes(1);
    expect(mockSqlFormatter).toBeCalledWith('select * from table2');
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue(
      'SELECT * FROM table3;'
    );

    selectOptionByIndex('order.sqlInfo.instanceName', 'instance1');
    await act(async () => jest.advanceTimersByTime(0));

    expect(getInstanceSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => {
      fireEvent.click(screen.getByText('order.sqlInfo.format'));
    });
    expect(getInstanceSpy).toBeCalledTimes(2);
    expect(mockSqlFormatter).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockSqlFormatter).toBeCalledTimes(2);
    expect(mockSqlFormatter).toBeCalledWith('SELECT * FROM table3;', 'mysql');

    fireEvent.click(screen.getByText('order.sqlInfo.uploadFile'));
    fireEvent.click(screen.getByText('order.sqlInfo.format'));
    expect(mockSqlFormatter).toBeCalledTimes(2);

    fireEvent.click(screen.getByText('order.sqlInfo.uploadMybatisFile'));
    fireEvent.click(screen.getByText('order.sqlInfo.format'));
    expect(mockSqlFormatter).toBeCalledTimes(2);

    //different sql mode
    fireEvent.click(screen.getByLabelText('order.sqlInfo.isSameSqlOrder'));

    fireEvent.click(screen.getByText('order.sqlInfo.format'));
    expect(mockSqlFormatter).toBeCalledTimes(2);

    fireEvent.click(screen.getByText('order.sqlInfo.uploadFile'));
    fireEvent.click(screen.getByText('order.sqlInfo.format'));
    expect(mockSqlFormatter).toBeCalledTimes(2);

    fireEvent.click(screen.getByText('order.sqlInfo.manualInput'));

    await act(async () => {
      fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
        target: { value: 'select * from table4' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('order.sqlInfo.format'));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceSpy).toBeCalledTimes(3);

    expect(mockSqlFormatter).toBeCalledTimes(3);
    expect(mockSqlFormatter).toBeCalledWith('select * from table4', 'mysql');
  });
});
