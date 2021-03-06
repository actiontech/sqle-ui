import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import WhitelistForm from '.';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '../../../api/common.enum';
import { renderWithTheme } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { SupportTheme } from '../../../theme';

describe('Whitelist/WhitelistForm', () => {
  beforeEach(() => {
    mockUseDispatch();
    mockUseSelector({ user: { theme: SupportTheme.LIGHT } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { container } = renderWithTheme(
      <WhitelistForm form={result.current[0]} />
    );
    expect(container).toMatchSnapshot();
    expect(Object.keys(result.current[0].getFieldsValue())).toEqual([
      'matchType',
      'desc',
      'sql',
    ]);
    expect(result.current[0].getFieldsValue()).toEqual({
      sql: '/* input your sql */',
      matchType: CreateAuditWhitelistReqV1MatchTypeEnum.exact_match,
    });
  });
});
