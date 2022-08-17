/* eslint-disable no-console */
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
  const error = console.error;

  beforeEach(() => {
    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
    });
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });

  afterEach(() => {
    console.error = error;
  });
  test('should match snapshot', () => {
    const { container } = render(<CommonRadialBar h={3} {...config} />);
    expect(container).toMatchSnapshot();
  });
});
