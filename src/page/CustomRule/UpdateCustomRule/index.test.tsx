/* eslint-disable no-console */
import { useTheme } from '@mui/styles';
import { renderWithRouterAndRedux } from '../../../testUtils/customRender';
import UpdateCustomRule from '.';
import { mockDriver, mockUseRuleType } from '../../../testUtils/mockRequest';
import { mockUseStyle } from '../../../testUtils/mockStyle';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/react';
import { getHrefByText } from '../../../testUtils/customQuery';
import { mockGetCustomRule, mockUpdateCustomRule } from '../__mockApi__';
import { SQLE_BASE_URL } from '../../../data/common';
import { useParams } from 'react-router-dom';

jest.mock('@mui/styles', () => {
  return {
    ...jest.requireActual('@mui/styles'),
    useTheme: jest.fn(),
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('test UpdateCustomRule', () => {
  let getCustomRuleSpy: jest.SpyInstance;

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ common: { padding: 24 } });
    (useParams as jest.Mock).mockReturnValue({ ruleID: '1' });

    mockUseRuleType();
    mockDriver();
    mockUseStyle();
    jest.useFakeTimers();
    getCustomRuleSpy = mockGetCustomRule();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  const error = console.error;
  beforeAll(() => {
    console.error = jest.fn((message: any) => {
      if (
        message.includes(
          'A component is changing an uncontrolled input to be controlled'
        )
      ) {
        return;
      }
      error(message);
    });
  });

  afterAll(() => {
    console.error = error;
  });
  test('should match snapshot', async () => {
    const { container } = renderWithRouterAndRedux(
      <UpdateCustomRule />,
      undefined,
      {
        user: {
          theme: 'light',
        },
      }
    );
    expect(getCustomRuleSpy).toBeCalledTimes(1);
    expect(getCustomRuleSpy).nthCalledWith(1, { rule_id: '1' });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.nextStep'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.prevStep'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(container).toMatchSnapshot();
  });

  test('should send update request hen clicked finally submit button', async () => {
    const updateSpy = mockUpdateCustomRule();
    renderWithRouterAndRedux(<UpdateCustomRule />, undefined, {
      user: {
        theme: 'light',
      },
    });

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.change(
      screen.getByLabelText('customRule.baseInfoForm.ruleName'),
      {
        target: { value: 'rule_name' },
      }
    );

    fireEvent.change(
      screen.getByLabelText('customRule.baseInfoForm.ruleDesc'),
      {
        target: { value: 'rule_desc' },
      }
    );

    fireEvent.click(screen.getByText('common.nextStep'));
    await act(async () => jest.advanceTimersByTime(0));

    await screen.findByText('customRule.editScriptForm.inputRuleScript');

    fireEvent.change(
      screen.getByLabelText('customRule.editScriptForm.inputRuleScript'),
      { target: { value: 'd+' } }
    );

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).nthCalledWith(1, {
      annotation: 'rule_desc',
      level: 'notice',
      desc: 'rule_name',
      rule_script: 'd+',
      type: 'rule_type1',
      rule_id: '1',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('customRule.editCustomRule.successTitle')
    ).toBeInTheDocument();
    expect(getHrefByText('customRule.editCustomRule.backToList')).toBe(
      `${SQLE_BASE_URL}rule/custom`
    );
  });
});
