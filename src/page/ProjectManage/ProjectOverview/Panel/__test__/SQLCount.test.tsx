/* eslint-disable no-console */
import { act } from '@testing-library/react';
import { renderWithRedux } from '../../../../../testUtils/customRender';
import SqlCount from '../SqlCount';
import { panelCommonProps } from './index.data';
import { mockStatisticsAuditedSQL } from './mockApi';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';

describe('test SQLCount', () => {
  let statisticsAuditedSQLSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    statisticsAuditedSQLSpy = mockStatisticsAuditedSQL();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const error = console.error;

  beforeAll(() => {
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });
  });

  afterAll(() => {
    console.error = error;
  });
  test('should match snapshot', async () => {
    const { container } = renderWithRedux(
      <SqlCount {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );

    expect(statisticsAuditedSQLSpy).toBeCalledTimes(1);
    expect(statisticsAuditedSQLSpy).toBeCalledWith({
      project_name: panelCommonProps.projectName,
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  test('should render error message', async () => {
    statisticsAuditedSQLSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ message: 'error message' })
    );

    const { container } = renderWithRedux(
      <SqlCount {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
