/* eslint-disable no-console */
import { act, fireEvent, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import Form, { useForm } from 'antd/lib/form/Form';
import { SqlStatementForm } from '..';
import { getBySelector } from '../../../../testUtils/customQuery';
import { renderWithTheme } from '../../../../testUtils/customRender';

import { SupportTheme } from '../../../../theme';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('test Order/SqlStatementForm', () => {
  let tempWarnConsole: typeof console.warn;

  beforeAll(() => {
    tempWarnConsole = console.warn;
    console.warn = (params: any) => {
      if (params === `async-validator:`) {
        return;
      }
      tempWarnConsole(params);
    };
  });

  afterAll(() => {
    console.warn = tempWarnConsole;
  });

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => jest.fn());
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
      })
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should match snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { container } = renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementForm form={result.current[0]} />
      </Form>
    );
    expect(container).toMatchSnapshot();
  });

  test('should render corresponding form items with current input type', async () => {
    const { result } = renderHook(() => useForm());

    renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementForm form={result.current[0]} />
      </Form>
    );

    expect(screen.getByText('order.sqlInfo.uploadType')).toBeInTheDocument();
    expect(screen.getByLabelText('order.sqlInfo.manualInput')).toHaveAttribute(
      'checked'
    );
    expect(screen.queryByLabelText('order.sqlInfo.sql')).toHaveValue(
      '/* input your sql */'
    );

    fireEvent.change(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select (1)' },
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByLabelText('order.sqlInfo.sql')).toBeInTheDocument();
    expect(
      screen.queryByLabelText('order.sqlInfo.sqlFile')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('order.sqlInfo.mybatisFile')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('order.sqlInfo.uploadFile'));
    expect(
      screen.queryByLabelText('order.sqlInfo.sql')
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('order.sqlInfo.sqlFile')).toBeInTheDocument();
    expect(
      screen.queryByLabelText('order.sqlInfo.mybatisFile')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('order.sqlInfo.updateMybatisFile'));
    expect(
      screen.queryByLabelText('order.sqlInfo.sql')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('order.sqlInfo.sqlFile')
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText('order.sqlInfo.mybatisFile')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('order.sqlInfo.manualInput'));
    expect(screen.queryByLabelText('order.sqlInfo.sql')).toHaveValue(
      'select (1)'
    );
  });

  test('should remove form value when isClearFormWhenChangeSqlType is equal true and change current sql input', async () => {
    const { result } = renderHook(() => useForm());
    renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementForm
          form={result.current[0]}
          isClearFormWhenChangeSqlType={true}
        />
      </Form>
    );
    expect(screen.queryByLabelText('order.sqlInfo.sql')).toHaveValue(
      '/* input your sql */'
    );
    fireEvent.change(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select (1)' },
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByLabelText('order.sqlInfo.uploadFile'));
    fireEvent.click(screen.getByLabelText('order.sqlInfo.manualInput'));
    expect(screen.queryByLabelText('order.sqlInfo.sql')).toHaveValue(
      '/* input your sql */'
    );
  });

  test('should set upload file list to empty when click remove file', async () => {
    const { result } = renderHook(() => useForm());
    renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementForm
          form={result.current[0]}
          isClearFormWhenChangeSqlType={true}
        />
      </Form>
    );

    fireEvent.click(screen.getByText('order.sqlInfo.uploadFile'));
    const sqlFile = new File(
      [new Blob(['select * from table_test'], { type: 'text/plain' })],
      'test.sql'
    );
    fireEvent.change(screen.getByLabelText('order.sqlInfo.sqlFile'), {
      target: { files: [sqlFile] },
    });

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('test.sql')).toBeInTheDocument();

    fireEvent.click(getBySelector('button[title="Remove file"]'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.queryByText('test.sql')).not.toBeInTheDocument();
  });

  test('should hide update mybatis file radio when hideUpdateMybatisFile is equal true', () => {
    const { result } = renderHook(() => useForm());
    renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementForm
          form={result.current[0]}
          hideUpdateMybatisFile={true}
        />
      </Form>
    );
    expect(
      screen.queryByLabelText('order.sqlInfo.updateMybatisFile')
    ).not.toBeInTheDocument();
  });

  test('should set sql default value when fieldName is not undefined', () => {
    const { result } = renderHook(() => useForm());
    renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementForm
          form={result.current[0]}
          sqlStatement={'select (1)'}
        />
      </Form>
    );
    expect(screen.queryByLabelText('order.sqlInfo.sql')).toHaveValue(
      'select (1)'
    );
  });

  test('should be used default name when fieldName is undefined', () => {
    const { result } = renderHook(() => useForm());
    renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementForm
          form={result.current[0]}
          sqlStatement={'select (1)'}
        />
      </Form>
    );

    expect(getBySelector('.ant-radio-group')).toHaveAttribute(
      'id',
      '0_sqlInputType'
    );
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveAttribute(
      'id',
      '0_sql'
    );

    fireEvent.click(screen.getByLabelText('order.sqlInfo.uploadFile'));
    expect(screen.getByLabelText('order.sqlInfo.sqlFile')).toHaveAttribute(
      'id',
      '0_sqlFile'
    );

    fireEvent.click(screen.getByLabelText('order.sqlInfo.updateMybatisFile'));
    expect(screen.getByLabelText('order.sqlInfo.mybatisFile')).toHaveAttribute(
      'id',
      '0_mybatisFile'
    );
  });

  test('should set form item name with fieldName', () => {
    const { result } = renderHook(() => useForm());
    renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementForm
          form={result.current[0]}
          sqlStatement={'select (1)'}
          fieldName={'1'}
        />
      </Form>
    );

    expect(getBySelector('.ant-radio-group')).toHaveAttribute(
      'id',
      '1_sqlInputType'
    );
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveAttribute(
      'id',
      '1_sql'
    );

    fireEvent.click(screen.getByLabelText('order.sqlInfo.uploadFile'));
    expect(screen.getByLabelText('order.sqlInfo.sqlFile')).toHaveAttribute(
      'id',
      '1_sqlFile'
    );

    fireEvent.click(screen.getByLabelText('order.sqlInfo.updateMybatisFile'));
    expect(screen.getByLabelText('order.sqlInfo.mybatisFile')).toHaveAttribute(
      'id',
      '1_mybatisFile'
    );
  });
});
