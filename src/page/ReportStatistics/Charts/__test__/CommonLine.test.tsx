import { LineConfig } from '@ant-design/plots';
import { useTheme } from '@material-ui/styles';
import { SupportLanguage } from '../../../../locale';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import { SupportTheme } from '../../../../theme';
import CommonLine from '../CommonLine';
import { lineData } from './index.data';
import { render } from '@testing-library/react';

const config: LineConfig = {
  data: lineData,
  xField: 'date',
  yField: 'value',
};

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: jest.fn(),
  };
});

describe.skip('test CommonLine', () => {
  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  beforeEach(() => {
    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
    });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });

  test('should match snapshot', () => {
    const { container } = render(<CommonLine h={3} {...config} />);
    expect(container).toMatchSnapshot();
  });
});
