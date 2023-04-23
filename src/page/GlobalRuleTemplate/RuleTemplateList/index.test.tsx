import { fireEvent, screen, act } from '@testing-library/react';
import RuleTemplateList from '.';
import rule_template from '../../../api/rule_template';
import { SystemRole } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { renderWithRouter } from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { ruleTemplateListData } from '../__testData__';

import { getBySelector, getHrefByText } from '../../../testUtils/customQuery';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('RuleTemplate/RuleTemplateList', () => {
  const mockDispatch = jest.fn();
  let getRuleTemplateListSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getRuleTemplateListSpy = mockGetRuleTemplateList();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
        user: {
          role: SystemRole.admin,
        },
      })
    );

    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
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
    await act(async () => jest.advanceTimersByTime(3000));

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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getListSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getAllByText('common.delete')[1]);
    expect(
      screen.getByText('ruleTemplate.deleteRuleTemplate.tips')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({
      rule_template_name: ruleTemplateListData[1].rule_template_name,
    });
    expect(
      screen.getByText('ruleTemplate.deleteRuleTemplate.deleting')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('ruleTemplate.deleteRuleTemplate.deleteSuccessTips')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('ruleTemplate.deleteRuleTemplate.deleting')
    ).not.toBeInTheDocument();
    expect(getListSpy).toBeCalledTimes(2);
  });

  test('should send export rule template request when user click export rule template button', async () => {
    const exportSpy = mockExportRuleTemplate();
    renderWithRouter(<RuleTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseEnter(screen.getAllByText('common.more')[0]);
    await screen.findByText('ruleTemplate.exportRuleTemplate.button');

    expect(
      screen.getByText('ruleTemplate.exportRuleTemplate.button')
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
      screen.getByText('ruleTemplate.exportRuleTemplate.exporting')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('ruleTemplate.exportRuleTemplate.exportSuccessTips')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('ruleTemplate.exportRuleTemplate.exporting')
    ).not.toBeInTheDocument();
  });

  test('should open clone rule template modal when use click clone this template', async () => {
    renderWithRouter(<RuleTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));

    mockDispatch.mockClear();
    fireEvent.mouseEnter(screen.getAllByText('common.more')[0]);
    await screen.findByText('ruleTemplate.cloneRuleTemplate.button');

    expect(
      screen.getByText('ruleTemplate.cloneRuleTemplate.button')
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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getRuleTemplateListSpy).toBeCalledTimes(1);
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Global_Rule_Template_List);
    });
    expect(getRuleTemplateListSpy).toBeCalledTimes(2);
  });

  test('should hide the creation button and the action column when the user role is not an admin', () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
        user: {
          role: 'test',
        },
      })
    );

    renderWithRouter(<RuleTemplateList />);

    expect(
      screen.queryByText('globalRuleTemplate.createRuleTemplate.button')
    ).not.toBeInTheDocument();

    expect(screen.queryByText('common.operate')).not.toBeInTheDocument();
  });

  test('should render rule link when rule template name is not empty', async () => {
    renderWithRouter(<RuleTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getHrefByText(ruleTemplateListData[0].rule_template_name!)).toBe(
      '/rule?ruleTemplateName=default_mysql'
    );
  });

  test('should jump to next page when user click next page button', async () => {
    getRuleTemplateListSpy.mockImplementation(() =>
      resolveThreeSecond(
        Array.from({ length: 11 }, (_, i) => ({
          ...ruleTemplateListData[0],
          rule_template_name: `default_mysql_${i}`,
        })),
        { otherData: { total_nums: 11 } }
      )
    );
    renderWithRouter(<RuleTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.ant-pagination-next'));
    expect(getRuleTemplateListSpy).toBeCalledWith({
      page_index: 2,
      page_size: 10,
    });
    fireEvent.click(getBySelector('.ant-pagination-prev'));
    expect(getRuleTemplateListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
  });
});
