import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import WhitelistForm from '.';
import { renderWithTheme } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { SupportTheme } from '../../../theme';
// https://github.com/react-monaco-editor/react-monaco-editor/issues/176
jest.mock('react-monaco-editor', () => {
  return (props: any) => <input {...props} />;
});

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
      'desc',
      'sql',
    ]);
    expect(result.current[0].getFieldsValue()).toEqual({
      sql: '/* input your sql */',
    });
  });
});
