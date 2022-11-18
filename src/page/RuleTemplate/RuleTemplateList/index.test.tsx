import { fireEvent, waitFor, screen, act } from '@testing-library/react';
import RuleTemplateList from '.';
import rule_template from '../../../api/rule_template';
import { SystemRole } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { renderWithRouter } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { ruleTemplateListData } from '../__testData__';

describe.skip('RuleTemplate/RuleTemplateList', () => {
  let mockDispatch: jest.Mock;
  let getRuleTemplateListSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getRuleTemplateListSpy = mockGetRuleTemplateList();
    const { scopeDispatch } = mockUseDispatch();
    mockUseSelector({
      ruleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
      user: {
        role: SystemRole.admin,
      },
    });
    mockDispatch = scopeDispatch;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetRuleTemplateList = () => {
    const spy = jest.spyOn(rule_template, 'getRuleTemplateListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(ruleTemplateListData, { otherData: { total_nums: 1 } })
    );
    return spy;
  };

  const mockDeleteRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'deleteRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = renderWithRouter(<RuleTemplateList />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalStatus: {
          CLONE_RULE_TEMPLATE: false,
        },
      },
      type: 'ruleTemplate/initModalStatus',
    });
    expect(container).toMatchSnapshot();
  });

  test('should send delete rule template request when user click delete rule template button', async () => {
    const getListSpy = mockGetRuleTemplateList();
    const deleteSpy = mockDeleteRuleTemplate();
    renderWithRouter(<RuleTemplateList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getListSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getAllByText('common.delete')[1]);
    expect(
      screen.queryByText('ruleTemplate.deleteRuleTemplate.tips')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({
      rule_template_name: ruleTemplateListData[1].rule_template_name,
    });
    expect(
      screen.queryByText('ruleTemplate.deleteRuleTemplate.deleting')
    ).toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('ruleTemplate.deleteRuleTemplate.deleteSuccessTips')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('ruleTemplate.deleteRuleTemplate.deleting')
    ).not.toBeInTheDocument();
    expect(getListSpy).toBeCalledTimes(2);
  });

  test('should open clone rule template modal when use click clone this template', async () => {
    renderWithRouter(<RuleTemplateList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    mockDispatch.mockClear();
    fireEvent.mouseEnter(screen.getAllByText('common.more')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });

    expect(
      screen.queryByText('ruleTemplate.cloneRuleTemplate.button')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('ruleTemplate.cloneRuleTemplate.button'));
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).nthCalledWith(1, {
      payload: {
        ruleTemplate: ruleTemplateListData[0],
      },
      type: 'ruleTemplate/updateSelectRuleTemplate',
    });
    expect(mockDispatch).nthCalledWith(2, {
      payload: {
        modalName: 'CLONE_RULE_TEMPLATE',
        status: true,
      },
      type: 'ruleTemplate/updateModalStatus',
    });
  });

  test('should refresh list when receive "Refresh_Rule_Template_List" event', async () => {
    renderWithRouter(<RuleTemplateList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getRuleTemplateListSpy).toBeCalledTimes(1);
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Rule_Template_List);
    });
    expect(getRuleTemplateListSpy).toBeCalledTimes(2);
  });

  test('should hide the creation button and the action column when the user role is not an admin', () => {
    mockUseSelector({
      ruleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
      user: {
        role: 'test',
      },
    });

    renderWithRouter(<RuleTemplateList />);

    expect(
      screen.queryByText('ruleTemplate.createRuleTemplate.button')
    ).not.toBeInTheDocument();

    expect(screen.queryByText('common.operate')).not.toBeInTheDocument();
  });
});
