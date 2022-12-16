import { fireEvent, waitFor, screen, act } from '@testing-library/react';
import RuleTemplateList from '.';
import rule_template from '../../../api/rule_template';
import { SystemRole } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { ruleTemplateListData } from '../__testData__';
import { createMemoryHistory } from 'history';

describe('RuleTemplate/RuleTemplateList', () => {
  let mockDispatch: jest.Mock;
  let getRuleTemplateListSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getRuleTemplateListSpy = mockGetRuleTemplateList();
    const { scopeDispatch } = mockUseDispatch();
    mockUseSelector({
      globalRuleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
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

  const mockExportRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'exportRuleTemplateV1');
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
      type: 'globalRuleTemplate/initModalStatus',
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

  test('should send export rule template request when user click export rule template button', async () => {
    const exportSpy = mockExportRuleTemplate();
    renderWithRouter(<RuleTemplateList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseEnter(screen.getAllByText('common.more')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    expect(
      screen.queryByText('ruleTemplate.exportRuleTemplate.button')
    ).toBeInTheDocument();
    expect(exportSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('ruleTemplate.exportRuleTemplate.button'));
    expect(exportSpy).toBeCalledTimes(1);
    expect(exportSpy).toBeCalledWith(
      {
        rule_template_name: ruleTemplateListData[0].rule_template_name,
      },
      { responseType: 'blob' }
    );
    expect(
      screen.queryByText('ruleTemplate.exportRuleTemplate.exporting')
    ).toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('ruleTemplate.exportRuleTemplate.exportSuccessTips')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('ruleTemplate.exportRuleTemplate.exporting')
    ).not.toBeInTheDocument();
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
      type: 'globalRuleTemplate/updateGlobalSelectRuleTemplate',
    });
    expect(mockDispatch).nthCalledWith(2, {
      payload: {
        modalName: 'CLONE_RULE_TEMPLATE',
        status: true,
      },
      type: 'globalRuleTemplate/updateModalStatus',
    });
  });

  test('should refresh list when receive "Refresh_Global_Rule_Template_List" event', async () => {
    renderWithRouter(<RuleTemplateList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getRuleTemplateListSpy).toBeCalledTimes(1);
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Global_Rule_Template_List);
    });
    expect(getRuleTemplateListSpy).toBeCalledTimes(2);
  });

  test('should hide the creation button and the action column when the user role is not an admin', () => {
    mockUseSelector({
      globalRuleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
      user: {
        role: 'test',
      },
    });

    renderWithRouter(<RuleTemplateList />);

    expect(
      screen.queryByText('globalRuleTemplate.createRuleTemplate.button')
    ).not.toBeInTheDocument();

    expect(screen.queryByText('common.operate')).not.toBeInTheDocument();
  });

  test('should render rule link when rule template name is not empty', async () => {
    let history = createMemoryHistory();
    renderWithServerRouter(<RuleTemplateList />, undefined, { history });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(
      screen.getByText(ruleTemplateListData[0].rule_template_name!)
    );
    expect(history.location.pathname).toBe('/rule');
    expect(history.location.search).toBe('?ruleTemplateName=default_mysql');
  });
});
