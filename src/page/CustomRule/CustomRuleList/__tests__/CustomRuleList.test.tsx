import { act } from 'react-dom/test-utils';
import { renderWithRouter } from '../../../../testUtils/customRender';
import { mockDeleteCustomRule, mockGetCustomRules } from '../../__mockApi__';
import CustomRuleList from '../CustomRuleList';
import { mockDriver } from '../../../../testUtils/mockRequest';
import {
  getAllHrefByText,
  getBySelector,
  selectCustomOptionByClassName,
} from '../../../../testUtils/customQuery';
import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/react';
import { SQLE_BASE_URL } from '../../../../data/common';
import { customRules } from '../../__mockApi__/data';

describe('test CustomRuleList', () => {
  let getCustomRulesSpy: jest.SpyInstance;
  let deleteCustomRuleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockDriver();
    getCustomRulesSpy = mockGetCustomRules();
    deleteCustomRuleSpy = mockDeleteCustomRule();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithRouter(<CustomRuleList />);
    expect(container).toMatchSnapshot();
    expect(getCustomRulesSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(getAllHrefByText('customRule.editRule')[0]).toBe(
      `${SQLE_BASE_URL}rule/custom/update/${customRules[0].rule_id}`
    );
  });

  test('should filter custom rules when changed dbType and ruleName', async () => {
    renderWithRouter(<CustomRuleList />);

    expect(getCustomRulesSpy).toBeCalledTimes(1);
    expect(getCustomRulesSpy).nthCalledWith(1, {});

    await act(async () => jest.advanceTimersByTime(3000));

    selectCustomOptionByClassName(
      'customRule.filterForm.databaseType',
      'database-type-logo-wrapper',
      1
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(getCustomRulesSpy).toBeCalledTimes(2);
    expect(getCustomRulesSpy).nthCalledWith(2, {
      filter_db_type: 'mysql',
      filter_desc: '',
    });

    fireEvent.input(screen.getByLabelText('customRule.filterForm.ruleName'), {
      target: { value: 'test' },
    });

    fireEvent.click(getBySelector('.ant-input-search-button'));

    expect(getCustomRulesSpy).toBeCalledTimes(3);
    expect(getCustomRulesSpy).nthCalledWith(3, {
      filter_db_type: 'mysql',
      filter_desc: 'test',
    });
  });

  test('should send delete custom rule request when clicked delete button', async () => {
    renderWithRouter(<CustomRuleList />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('customRule.deleteRule')[0]);
    expect(screen.getByText('customRule.deleteConfirm')).toBeInTheDocument();
    expect(screen.getByText('common.ok')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.ok'));

    expect(deleteCustomRuleSpy).toBeCalledTimes(1);
    expect(deleteCustomRuleSpy).nthCalledWith(1, {
      rule_id: customRules[0].rule_id,
    });

    expect(
      screen.getAllByText('customRule.editRule')[0].closest('button')
    ).toBeDisabled();
    expect(
      screen.getAllByText('customRule.deleteRule')[0].closest('button')
    ).toBeDisabled();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getAllByText('customRule.editRule')[0].closest('button')
    ).not.toBeDisabled();
    expect(
      screen.getAllByText('customRule.deleteRule')[0].closest('button')
    ).not.toBeDisabled();

    expect(
      screen.getByText('customRule.deleteSuccessTips')
    ).toBeInTheDocument();
    expect(getCustomRulesSpy).toBeCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('customRule.deleteSuccessTips')
    ).not.toBeInTheDocument();
  });
});
