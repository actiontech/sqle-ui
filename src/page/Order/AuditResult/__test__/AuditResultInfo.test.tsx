import { render, screen } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector,
} from '../../../../testUtils/customQuery';
import AuditResultInfo from '../AuditResultInfo';
import { IAuditResult } from '../../../../api/common';
import { mockUseStyle } from '../../../../testUtils/mockStyle';

describe('Order/AuditResult/AuditResultInfo', () => {
  beforeEach(() => {
    mockUseStyle();
  });
  const multipleAuditResults: IAuditResult[] = [
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
    {
      level: 'normal',
      message: 'Test normal msg',
      rule_name: 'dml_check_select_limit',
    },
    {
      level: 'notice',
      message: 'Test notice msg',
      rule_name: '',
    },
  ];

  const singleAuditResult: IAuditResult[] = [
    { level: 'error', message: 'schema 不存在', rule_name: '' },
  ];

  test('should render audit result overview when get more than 2 audit results', () => {
    const { container } = render(
      <AuditResultInfo auditResult={multipleAuditResults} />
    );
    expect(container).toMatchSnapshot();
    expect(getAllBySelector('.result-box')).toHaveLength(4);

    expect(screen.getByText('error')).toBeInTheDocument();
    expect(getBySelector('.result-box-error :nth-child(3)').innerHTML).toBe(
      '2'
    );

    expect(screen.getByText('warn')).toBeInTheDocument();
    expect(
      getBySelector(':nth-child(3)', getAllBySelector('.result-box-warn')[0])
        .innerHTML
    ).toBe('1');

    expect(screen.getByText('normal')).toBeInTheDocument();

    expect(screen.getByText('notice')).toBeInTheDocument();
    expect(
      getBySelector(':nth-child(3)', getAllBySelector('.result-box-notice')[0])
        .innerHTML
    ).toBe('1');
  });

  test('should render single audit result detail when only get one audit result', () => {
    const { container } = render(
      <AuditResultInfo auditResult={singleAuditResult} />
    );
    expect(container).toMatchSnapshot();
    expect(screen.getByText('schema 不存在')).toBeInTheDocument();
  });

  test('should render passed when there is no audit result', () => {
    const { container } = render(<AuditResultInfo auditResult={[]} />);
    expect(container).toMatchSnapshot();
    expect(screen.getByText('passed')).toBeInTheDocument();
  });
});
