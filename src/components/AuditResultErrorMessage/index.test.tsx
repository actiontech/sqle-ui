import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuditResultErrorMessage from '.';
import { IAuditResult } from '../../api/common';
import { mockGetAllRules } from '../../page/Rule/__test__/utils';

describe('AuditResultErrorMessage', () => {
  const auditResult: IAuditResult[] = [
    { level: 'error', message: 'schema 不存在', rule_name: '' },
    {
      level: 'error',
      message:
        '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
      rule_name: 'all_check_where_is_invalid',
    },
    {
      level: 'warn',
      message: 'select 语句必须带limit,且限制数不得超过1000',
      rule_name: 'dml_check_select_limit',
    },
  ];

  let getRulesSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getRulesSpy = mockGetAllRules();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should call getRuleList when rule name is not empty', async () => {
    const { rerender, baseElement } = render(<AuditResultErrorMessage />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(baseElement).toMatchSnapshot();
    expect(getRulesSpy).toBeCalledTimes(0);

    rerender(<AuditResultErrorMessage auditResult={auditResult} />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(baseElement).toMatchSnapshot();
    expect(getRulesSpy).toBeCalledTimes(1);
    expect(getRulesSpy).nthCalledWith(1, {
      filter_rule_names: 'all_check_where_is_invalid,dml_check_select_limit',
    });

    fireEvent.mouseEnter(
      screen.getByText(
        '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql'
      )
    );

    await waitFor(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(
      screen.queryByText(
        'SQL缺少where条件在执行时会进行全表扫描产生额外开销，建议在大数据量高并发环境下开启，避免影响数据库查询性能'
      )
    ).toBeInTheDocument();
  });

  test('should render normal level when not match level', () => {
    const { container } = render(
      <AuditResultErrorMessage
        auditResult={[
          {
            message:
              '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
          },
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
