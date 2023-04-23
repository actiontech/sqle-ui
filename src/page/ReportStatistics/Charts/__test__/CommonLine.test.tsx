/* eslint-disable no-console */
import { LineConfig } from '@ant-design/plots';
import { useTheme } from '@mui/styles';
import { SupportLanguage } from '../../../../locale';
import { SupportTheme } from '../../../../theme';
import CommonLine from '../CommonLine';
import { lineData } from './index.data';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';

const config: LineConfig = {
  data: lineData,
  xField: 'date',
  yField: 'value',
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

describe('test CommonLine', () => {
  const useThemeMock: jest.Mock = useTheme as jest.Mock;
  const error = console.error;

  beforeEach(() => {
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
        locale: { language: SupportLanguage.zhCN },
      })
    );
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });
  afterEach(() => {
    console.error = error;
  });

  test('should match snapshot', () => {
    const { container } = render(<CommonLine h={3} {...config} />);
    expect(container).toMatchSnapshot();
  });
});
