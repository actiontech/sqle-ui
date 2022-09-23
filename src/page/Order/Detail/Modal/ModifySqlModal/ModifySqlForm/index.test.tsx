/* eslint-disable no-console */
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ModifySqlForm from '.';
import { getBySelector } from '../../../../../../testUtils/customQuery';
import { renderWithTheme } from '../../../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../../testUtils/mockRedux';
import { SupportTheme } from '../../../../../../theme';

describe('Order/Detail/Modal/ModifySqlModal/ModifySqlForm', () => {
  let tempErrorConsole: typeof console.error;
  let tempWarnConsole: typeof console.warn;

  beforeAll(() => {
    tempWarnConsole = console.warn;
    tempErrorConsole = console.error;
    console.warn = (params: any) => {
      if (params === `async-validator:`) {
        return;
      }
      tempWarnConsole(params);
    };
    console.error = (params: any) => {
      if (
        params.includes('A component is changing an uncontrolled input to be ')
      ) {
        return;
      }
      tempErrorConsole(params);
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
    console.error = tempErrorConsole;
  });

  test('should set upload file list to empty when click remove file', async () => {
    renderWithTheme(
      <ModifySqlForm
        currentDefaultSqlValue=""
        updateSqlFormInfo={jest.fn()}
        currentTaskId="22"
      />
    );
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
  });

  test('should set default sql content when currentDefaultSqlValue is empty', () => {
    renderWithTheme(
      <ModifySqlForm
        currentDefaultSqlValue=""
        updateSqlFormInfo={jest.fn()}
        currentTaskId="22"
      />
    );

    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue(
      '/* input your sql */'
    );
  });

  test('should set sql content when currentDefaultSqlValue is not empty', () => {
    renderWithTheme(
      <ModifySqlForm
        currentDefaultSqlValue="test sql"
        updateSqlFormInfo={jest.fn()}
        currentTaskId="22"
      />
    );
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue('test sql');
  });

  test('should call updateSqlFormInfo props when form changing values', () => {
    const mockUpdateSqlFormInfo = jest.fn();
    renderWithTheme(
      <ModifySqlForm
        currentDefaultSqlValue=""
        updateSqlFormInfo={mockUpdateSqlFormInfo}
        currentTaskId="22"
      />
    );
    expect(mockUpdateSqlFormInfo).toBeCalledTimes(0);
    fireEvent.change(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'test sql' },
    });
    expect(mockUpdateSqlFormInfo).toBeCalledTimes(1);
    expect(mockUpdateSqlFormInfo).toBeCalledWith('22', {
      sql: 'test sql',
      sqlInputType: 0,
    });
  });
});
