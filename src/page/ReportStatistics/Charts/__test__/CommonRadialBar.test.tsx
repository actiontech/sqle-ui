import { RadialBarConfig } from '@ant-design/plots';
import { useTheme } from '@material-ui/styles';
import { render } from '@testing-library/react';
import { SupportLanguage } from '../../../../locale';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import { SupportTheme } from '../../../../theme';
import CommonRadialBar from '../CommonRadialBar';
import { radialBarData } from './index.data';

const config: RadialBarConfig = {
  data: radialBarData,
  xField: 'type',
  yField: 'percent',
  colorField: 'type',
};

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: jest.fn(),
  };
});
describe('test CommonRadialBar', () => {
  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  beforeEach(() => {
    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
    });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });
  test('should match snapshot', () => {
    const { container } = render(<CommonRadialBar h={3} {...config} />);
    expect(container).toMatchSnapshot();
  });
});
