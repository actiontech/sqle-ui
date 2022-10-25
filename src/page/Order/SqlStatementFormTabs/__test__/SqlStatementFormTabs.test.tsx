import { act, fireEvent, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import Form, { useForm } from 'antd/lib/form/Form';
import { useRef } from 'react';
import { SqlStatementFormTabs, SqlStatementFormTabsRefType } from '..';
import { renderWithTheme } from '../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import { SupportTheme } from '../../../../theme';
import { sqlStatementInfo } from './test.data';

describe('test Order/SqlStatementFormTabs', () => {
  beforeEach(() => {
    mockUseDispatch();
    mockUseSelector({ user: { theme: SupportTheme.LIGHT } });
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
        <SqlStatementFormTabs
          form={result.current[0]}
          sqlStatementInfo={sqlStatementInfo}
        />
      </Form>
    );

    expect(container).toMatchSnapshot();
  });

  test('should get activeIndex and activeKey with ref', () => {
    const { result } = renderHook(() => useForm());
    const { result: ref } = renderHook(() =>
      useRef<SqlStatementFormTabsRefType>(null)
    );

    renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementFormTabs
          ref={ref.current}
          form={result.current[0]}
          sqlStatementInfo={sqlStatementInfo}
        />
      </Form>
    );

    expect(ref.current.current?.activeIndex).toBe(sqlStatementInfo.length - 1);
    expect(ref.current.current?.activeKey).toBe(
      sqlStatementInfo[sqlStatementInfo.length - 1].key
    );
  });

  test('should called tabsChangeHandle when click tab or use ref', () => {
    const { result } = renderHook(() => useForm());
    const { result: ref } = renderHook(() =>
      useRef<SqlStatementFormTabsRefType>(null)
    );
    const mockTabChange = jest.fn();

    renderWithTheme(
      <Form form={result.current[0]}>
        <SqlStatementFormTabs
          ref={ref.current}
          form={result.current[0]}
          sqlStatementInfo={sqlStatementInfo}
          tabsChangeHandle={mockTabChange}
        />
      </Form>
    );
    expect(mockTabChange).toBeCalledTimes(0);
    fireEvent.click(screen.getByText(sqlStatementInfo[1].instanceName));
    expect(mockTabChange).toBeCalledTimes(1);
    expect(mockTabChange).toBeCalledWith(sqlStatementInfo[1].key);

    act(() => {
      ref.current.current?.tabsChangeHandle(sqlStatementInfo[0].key);
    });
    expect(mockTabChange).toBeCalledTimes(2);
    expect(mockTabChange).toBeCalledWith(sqlStatementInfo[0].key);
  });
});
