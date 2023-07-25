/* eslint-disable no-console */
import { useTheme } from '@mui/styles';
import { renderWithRouterAndRedux } from '../../../testUtils/customRender';
import CreateCustomRule from '.';
import { mockDriver, mockUseRuleType } from '../../../testUtils/mockRequest';
import { mockUseStyle } from '../../../testUtils/mockStyle';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/react';
import {
  getHrefByText,
  selectCustomOptionByClassName,
} from '../../../testUtils/customQuery';
import { mockCreateCustomRule } from '../__mockApi__';
import { SQLE_BASE_URL } from '../../../data/common';

jest.mock('@mui/styles', () => {
  return {
    ...jest.requireActual('@mui/styles'),
    useTheme: jest.fn(),
  };
});

describe('test CreateCustomRule', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ common: { padding: 24 } });
    mockUseRuleType();
    mockDriver();
    mockUseStyle();
    jest.useFakeTimers();
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
  test('should match snapshot', () => {
    const { container } = renderWithRouterAndRedux(
      <CreateCustomRule />,
      undefined,
      {
        user: {
          theme: 'light',
        },
      }
    );

    expect(container).toMatchSnapshot();
  });

  test('should send create request hen clicked finally submit button', async () => {
    const createSpy = mockCreateCustomRule();
    renderWithRouterAndRedux(<CreateCustomRule />, undefined, {
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

    selectCustomOptionByClassName(
      'customRule.baseInfoForm.dbType',
      'database-type-logo-wrapper',
      1
    );
    await act(async () => jest.advanceTimersByTime(0));

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      screen.getByLabelText('customRule.baseInfoForm.ruleType')
    );

    await screen.findByText('customRule.baseInfoForm.addExtraRuleType');
    await screen.findByTestId('add-rule-type');

    fireEvent.change(screen.getByTestId('add-rule-type'), {
      target: { value: 'custom_rule' },
    });

    fireEvent.click(
      screen.getByText('customRule.baseInfoForm.addExtraRuleType')
    );
    fireEvent.click(screen.getByText('custom_rule'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('common.nextStep'));
    await act(async () => jest.advanceTimersByTime(0));

    await screen.findByText('customRule.editScriptForm.inputRuleScript');

    fireEvent.change(
      screen.getByLabelText('customRule.editScriptForm.inputRuleScript'),
      { target: { value: 'w+' } }
    );

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => jest.advanceTimersByTime(0));
    expect(createSpy).toBeCalledTimes(1);
    expect(createSpy).nthCalledWith(1, {
      db_type: 'mysql',
      annotation: 'rule_desc',
      level: 'notice',
      desc: 'rule_name',
      rule_script: 'w+',
      type: 'custom_rule',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('customRule.addCustomRule.successTitle')
    ).toBeInTheDocument();
    expect(getHrefByText('customRule.addCustomRule.backToList')).toBe(
      `${SQLE_BASE_URL}rule/custom`
    );
  });
});
