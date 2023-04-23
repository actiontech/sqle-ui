import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import WhitelistForm from '.';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '../../../api/common.enum';
import { renderWithThemeAndRedux } from '../../../testUtils/customRender';
import { SupportTheme } from '../../../theme';

describe('Whitelist/WhitelistForm', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { container } = renderWithThemeAndRedux(
      <WhitelistForm form={result.current[0]} />,
      undefined,
      {
        user: { theme: SupportTheme.LIGHT },
      }
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
