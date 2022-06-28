import { fireEvent, render } from '@testing-library/react';
import { sqlExecPlans, tableSchemas } from '../../SqlQuery/__testData__';
import SqlAnalyze from './SqlAnalyze';

describe('SqlAnalyze/SqlAnalyze', () => {
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

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error = error;
  });

  test('should render loading status by "loading" value of props', () => {
    const { container, rerender } = render(
      <SqlAnalyze
        tableSchemas={tableSchemas.map((e) => e.tableMeta)}
        sqlExplain={sqlExecPlans[0]}
        loading={true}
        errorMessage=""
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <SqlAnalyze
        tableSchemas={tableSchemas.map((e) => e.tableMeta)}
        sqlExplain={sqlExecPlans[0]}
        loading={false}
        errorMessage=""
      />
    );
    expect(container).toMatchSnapshot();
    fireEvent.click(container.querySelectorAll('.ant-tabs-tab-btn')[1]);
    fireEvent.click(container.querySelectorAll('.ant-tabs-tab-btn')[2]);
    expect(container).toMatchSnapshot();
  });

  test('should render errorMessage when "errorMessage" is not empty', () => {
    const { container } = render(
      <SqlAnalyze
        tableSchemas={tableSchemas.map((e) => e.tableMeta)}
        sqlExplain={sqlExecPlans[0]}
        loading={false}
        errorMessage="error"
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should render errorMessage by errorType field when "errorMessage" is not empty', () => {
    const { container } = render(
      <SqlAnalyze
        tableSchemas={tableSchemas.map((e) => e.tableMeta)}
        sqlExplain={sqlExecPlans[0]}
        loading={false}
        errorMessage="error"
        errorType="info"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
