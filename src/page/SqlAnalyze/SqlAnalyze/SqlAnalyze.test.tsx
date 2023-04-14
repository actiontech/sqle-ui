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
        tableMetas={{
          table_meta_items: tableSchemas.map((e) => e.tableMeta),
          err_message: '',
        }}
        sqlExplain={sqlExecPlans[0]}
        loading={true}
        performanceStatistics={{ affect_rows: { count: 10, err_message: '' } }}
        errorMessage=""
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <SqlAnalyze
        tableMetas={{
          table_meta_items: tableSchemas.map((e) => e.tableMeta),
          err_message: '',
        }}
        sqlExplain={sqlExecPlans[0]}
        performanceStatistics={{
          affect_rows: { count: 0, err_message: 'error' },
        }}
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
        tableMetas={{
          table_meta_items: tableSchemas.map((e) => e.tableMeta),
          err_message: '',
        }}
        sqlExplain={sqlExecPlans[0]}
        loading={false}
        errorMessage="error"
        performanceStatistics={{ affect_rows: { count: 10, err_message: '' } }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should render errorMessage by errorType field when "errorMessage" is not empty', () => {
    const { container } = render(
      <SqlAnalyze
        tableMetas={{
          table_meta_items: tableSchemas.map((e) => e.tableMeta),
          err_message: '',
        }}
        sqlExplain={sqlExecPlans[0]}
        loading={false}
        errorMessage="error"
        errorType="info"
        performanceStatistics={{ affect_rows: { count: 10, err_message: '' } }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
