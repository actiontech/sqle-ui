import { useTheme } from '@material-ui/styles';
import {
  fireEvent,
  waitFor,
  screen,
  act,
  cleanup,
} from '@testing-library/react';
import { useParams } from 'react-router-dom';
import RuleTemplateList from '.';
import rule_template from '../../../api/rule_template';
import { SystemRole } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { ruleTemplateListData } from '../__testData__';
import { createMemoryHistory } from 'history';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: jest.fn(),
  };
});

describe('RuleTemplate/RuleTemplateList', () => {
  let mockDispatch: jest.Mock;
  let getRuleTemplateListSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    getRuleTemplateListSpy = mockGetRuleTemplateList();
    const { scopeDispatch } = mockUseDispatch();
    useParamsMock.mockReturnValue({ projectName });
    mockGetGlobalRuleTemplateList();
    mockUseSelector({
      globalRuleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
      ruleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
      user: { role: SystemRole.admin, bindProjects: mockBindProjects },
    });
    mockDispatch = scopeDispatch;
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetGlobalRuleTemplateList = () => {
    const spy = jest.spyOn(rule_template, 'getRuleTemplateListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond([], { otherData: { total_nums: 0 } })
    );
    return spy;
  };

  const mockGetRuleTemplateList = () => {
    const spy = jest.spyOn(rule_template, 'getProjectRuleTemplateListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(ruleTemplateListData, { otherData: { total_nums: 1 } })
    );
    return spy;
  };

  const mockDeleteRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'deleteProjectRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockExportRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'exportProjectRuleTemplateV1');
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
    expect(getListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
    fireEvent.click(screen.getAllByText('common.delete')[1]);
    expect(
      screen.queryByText('ruleTemplate.deleteRuleTemplate.tips')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({
      rule_template_name: ruleTemplateListData[1].rule_template_name,
      project_name: projectName,
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
    expect(getListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
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
        project_name: projectName,
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

  test('should hide the Create, Add, Edit feature when not currently a project manager or admin', async () => {
    mockUseSelector({
      globalRuleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
      ruleTemplate: {
        modalStatus: {},
        selectRuleTemplate: undefined,
      },
      user: {
        role: SystemRole.admin,
        bindProjects: [{ projectName: 'test', isManager: false }],
      },
    });

    renderWithRouter(<RuleTemplateList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('common.edit')[0]).toBeInTheDocument();
    expect(
      screen.queryByText('ruleTemplate.createRuleTemplate.button')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      globalRuleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
      ruleTemplate: {
        modalStatus: {},
        selectRuleTemplate: undefined,
      },
      user: {
        role: '',
        bindProjects: mockBindProjects,
      },
    });
    renderWithRouter(<RuleTemplateList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('common.edit')[0]).toBeInTheDocument();
    expect(
      screen.queryByText('ruleTemplate.createRuleTemplate.button')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      globalRuleTemplate: { modalStatus: {}, selectRuleTemplate: undefined },
      ruleTemplate: {
        modalStatus: {},
        selectRuleTemplate: undefined,
      },
      user: {
        role: '',
        bindProjects: [{ projectName: 'default', isManager: false }],
      },
    });
    renderWithRouter(<RuleTemplateList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.delete')).not.toBeInTheDocument();
    expect(screen.queryByText('common.edit')).not.toBeInTheDocument();
    expect(
      screen.queryByText('ruleTemplate.createRuleTemplate.button')
    ).not.toBeInTheDocument();
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
    expect(history.location.search).toBe(
      '?projectName=default&ruleTemplateName=default_mysql'
    );
  });
});
