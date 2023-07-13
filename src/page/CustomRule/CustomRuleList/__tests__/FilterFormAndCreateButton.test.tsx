import { act } from 'react-dom/test-utils';
import { renderWithRouter } from '../../../../testUtils/customRender';
import { mockDriver } from '../../../../testUtils/mockRequest';
import FilterFormAndCreateButton from '../FilterFormAndCreateButton';
import {
  getBySelector,
  getHrefByText,
  selectOptionByIndex,
} from '../../../../testUtils/customQuery';
import { SQLE_BASE_URL } from '../../../../data/common';
import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/react';

describe('test FilterFormAndCreateButton.test', () => {
  const mockGetCustomRuleList = jest.fn();
  let mockGetDriver: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetDriver = mockDriver();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  test('should match snapshot', async () => {
    const { container } = renderWithRouter(
      <FilterFormAndCreateButton getCustomRuleList={mockGetCustomRuleList} />
    );

    expect(mockGetDriver).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(getHrefByText('customRule.filterForm.add')).toBe(
      `${SQLE_BASE_URL}rule/custom/create`
    );
  });

  test('should execute "getCustomRuleList" when changed dbType and type ruleName', async () => {
    renderWithRouter(
      <FilterFormAndCreateButton getCustomRuleList={mockGetCustomRuleList} />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('customRule.filterForm.databaseType', 'mysql');
    await act(async () => jest.advanceTimersByTime(0));

    expect(mockGetCustomRuleList).toBeCalledTimes(1);
    expect(mockGetCustomRuleList).nthCalledWith(1, 'mysql', '');

    fireEvent.input(screen.getByLabelText('customRule.filterForm.ruleName'), {
      target: { value: 'test' },
    });
    expect(mockGetCustomRuleList).toBeCalledTimes(1);

    fireEvent.click(getBySelector('.ant-input-search-button'));

    expect(mockGetCustomRuleList).toBeCalledTimes(2);
    expect(mockGetCustomRuleList).nthCalledWith(2, 'mysql', 'test');
  });
});
