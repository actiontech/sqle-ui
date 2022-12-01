import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';
import { sqlExecPlans } from '../../SqlQuery/__testData__';
import useSQLExecPlan from './useSQLExecPlan';

describe('useSQLExecPlan', () => {
  // eslint-disable-next-line no-console
  const error = console.error;

  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // eslint-disable-next-line no-console
    (console.error as any).mockImplementation((message: any) => {
      if (
        message.includes('Each child in a list should have a unique "key" prop')
      ) {
        return;
      }
      error(message);
    });
  });
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error = error;
  });

  test('should render sqlExecPlan cad when user call "generateSQLExecPlanContent" method', async () => {
    const { result } = renderHook(() => useSQLExecPlan());
    const { container } = render(
      <div>
        {sqlExecPlans.map((e) => result.current.generateSQLExecPlanContent(e))}
      </div>
    );
    expect(container).toMatchSnapshot();
  });

  test('should render info message when sql exec plan include "message" field', async () => {
    const { result } = renderHook(() => useSQLExecPlan());
    const data = cloneDeep(sqlExecPlans);
    data[0].message = '123';
    const { container } = render(
      <div>{data.map((e) => result.current.generateSQLExecPlanContent(e))}</div>
    );
    expect(container).toMatchSnapshot();
  });
});
