/* eslint-disable no-console */
import { useTheme } from '@material-ui/styles';
import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { SupportLanguage } from '../../../../locale';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../theme';
import InstanceProportionWithDbType from '../InstanceProportionWithDbType';
import mockRequestData from './mockRequestData';

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: jest.fn(),
  };
});

const { InstanceProportionWithDbTypeData } = mockRequestData;

describe('test InstanceProportionWithDbType', () => {
  const mockGetInstancesTypePercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getInstancesTypePercentV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(InstanceProportionWithDbTypeData);
    });
    return spy;
  };

  const mockErrorGetInstancesTypePercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getInstancesTypePercentV1');
    spy.mockImplementation(() => {
      return resolveErrorThreeSecond({});
    });
    return spy;
  };
  const useThemeMock: jest.Mock = useTheme as jest.Mock;
  const error = console.error;
  beforeEach(() => {
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });

    jest.useFakeTimers();

    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
      reportStatistics: { refreshFlag: false },
    });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    console.error = error;
  });

  test('should match snapshot', async () => {
    mockGetInstancesTypePercentV1();

    const { container } = render(<InstanceProportionWithDbType />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });
  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetInstancesTypePercentV1();
    const { container } = render(<InstanceProportionWithDbType />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getInstancesTypePercentV1 when first rendered', async () => {
    const getInstancesTypePercentV1Spy = mockGetInstancesTypePercentV1();
    render(<InstanceProportionWithDbType />);
    expect(getInstancesTypePercentV1Spy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
  });
});
