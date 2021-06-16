import { fireEvent, waitFor, screen } from '@testing-library/react';
import Rule from '.';
import instance from '../../api/instance';
import rule_template from '../../api/rule_template';
import { getBySelector } from '../../testUtils/customQuery';
import { renderWithTheme } from '../../testUtils/customRender';
import {
  mockUseInstance,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';
import { allRules, instanceRule } from './__testData__';

describe('Rule', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseInstance();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockGetAllRules = () => {
    const spy = jest.spyOn(rule_template, 'getRuleListV1');
    spy.mockImplementation(() => resolveThreeSecond(allRules));
    return spy;
  };

  const mockGetInstanceRules = () => {
    const spy = jest.spyOn(instance, 'getInstanceRuleListV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceRule));
    return spy;
  };

  test('should render page header', async () => {
    mockGetAllRules();
    const { container } = renderWithTheme(<Rule />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should render instance rule when user select a instance', async () => {
    mockGetAllRules();
    const getInstanceRuleSpy = mockGetInstanceRules();
    const { container } = renderWithTheme(<Rule />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.mouseDown(
      getBySelector('input', screen.getByTestId('instance-name'))
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const allOptions = screen.getAllByText('instance1');
    const option = allOptions[1];
    expect(option).toHaveClass('ant-select-item-option-content');
    fireEvent.click(option);

    expect(getInstanceRuleSpy).toBeCalledTimes(1);
    expect(getInstanceRuleSpy).toBeCalledWith({ instance_name: 'instance1' });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
