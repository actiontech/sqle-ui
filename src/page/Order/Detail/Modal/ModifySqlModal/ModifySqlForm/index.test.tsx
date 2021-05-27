import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import { act } from 'react-dom/test-utils';
import ModifySqlForm from '.';
import { getBySelector } from '../../../../../../testUtils/customQuery';
import { renderWithTheme } from '../../../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../../testUtils/mockRedux';
import { SupportTheme } from '../../../../../../theme';

// https://github.com/react-monaco-editor/react-monaco-editor/issues/176
jest.mock('react-monaco-editor', () => {
  return (props: any) => <input {...props} />;
});

describe('Order/Detail/Modal/ModifySqlModal/ModifySqlForm', () => {
  let tempWarnConsole: typeof console.warn;

  beforeAll(() => {
    // eslint-disable-next-line no-console
    tempWarnConsole = console.warn;
    // eslint-disable-next-line no-console
    console.warn = (params: any) => {
      if (params === `async-validator:`) {
        return;
      }
      tempWarnConsole(params);
    };
  });

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { theme: SupportTheme.LIGHT } });
    mockUseDispatch();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.warn = tempWarnConsole;
  });

  test('should set upload file list to empty when click remove file', async () => {
    const { result } = renderHook(() => useForm());
    renderWithTheme(<ModifySqlForm form={result.current[0]} />);
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
    expect(screen.queryByText('test.sql')).toBeInTheDocument();
    act(() => {
      fireEvent.click(getBySelector('button[title="Remove file"]'));
    });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.queryByText('test.sql')).not.toBeInTheDocument();
    expect(result.current[0].getFieldValue('sqlFile')).toEqual([]);
  });
});
