/* eslint-disable no-console */
import { RadialBarConfig } from '@ant-design/plots';
import { useTheme } from '@mui/styles';
import { render } from '@testing-library/react';
import { SupportLanguage } from '../../../../locale';
import { SupportTheme } from '../../../../theme';
import CommonRadialBar from '../CommonRadialBar';
import { radialBarData } from './index.data';
import { useSelector } from 'react-redux';

const config: RadialBarConfig = {
  data: radialBarData,
  xField: 'type',
  yField: 'percent',
  colorField: 'type',
};

jest.mock('@mui/styles', () => {
  return {
    ...jest.requireActual('@mui/styles'),
    useTheme: jest.fn(),
  };
});
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

describe('test CommonRadialBar', () => {
  const useThemeMock: jest.Mock = useTheme as jest.Mock;
  const error = console.error;

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
        locale: { language: SupportLanguage.zhCN },
      })
    );
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
