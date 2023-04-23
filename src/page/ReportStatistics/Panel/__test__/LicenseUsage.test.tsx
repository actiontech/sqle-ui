/* eslint-disable no-console */
import { useTheme } from '@mui/styles';
import { act, render } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { SupportLanguage } from '../../../../locale';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../theme';
import LicenseUsage from '../LicenseUsage';
import mockRequestData from './mockRequestData';
import { useSelector } from 'react-redux';

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

const { LicenseUsageData } = mockRequestData;

describe('test LicenseUsage', () => {
  const error = console.error;

  const mockGetLicenseUsageV1 = () => {
    const spy = jest.spyOn(statistic, 'getLicenseUsageV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(LicenseUsageData);
    });
    return spy;
  };

  const mockErrorGetLicenseUsageV1 = () => {
    const spy = jest.spyOn(statistic, 'getLicenseUsageV1');
    spy.mockImplementation(() => {
      return resolveErrorThreeSecond({});
    });
    return spy;
  };

  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  beforeEach(() => {
    console.error = jest.fn((message: any) => {
      if (
        message.includes('React does not recognize the') ||
        message.includes('Invalid value for prop')
      ) {
        return;
      }
      error(message);
    });

    jest.useFakeTimers();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
        locale: { language: SupportLanguage.zhCN },
        reportStatistics: { refreshFlag: false },
      })
    );
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    console.error = error;
  });

  test('should match snapshot', async () => {
    mockGetLicenseUsageV1();
    const { container } = render(<LicenseUsage />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetLicenseUsageV1();
    const { container } = render(<LicenseUsage />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should called getLicenseUsageV1Spy when first rendered', async () => {
    const getLicenseUsageV1Spy = mockGetLicenseUsageV1();
    render(<LicenseUsage />);
    expect(getLicenseUsageV1Spy).toBeCalledTimes(1);
  });

  test('should match snapshot when environment is qa', async () => {
    const spy = jest.spyOn(statistic, 'getLicenseUsageV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond({
        instances_usage: [
          {
            is_limited: false,
            limit: 0,
            resource_type: 'test1',
            used: 10,
          },
          {
            is_limited: false,
            limit: 0,
            resource_type: 'test2',
            used: 110,
          },
        ],
        users_usage: {
          is_limited: false,
          limit: 0,
          resource_type: 'user',
          used: 20,
        },
      });
    });

    const { container } = render(<LicenseUsage />);
    expect(spy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
