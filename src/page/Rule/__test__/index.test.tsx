import { act, fireEvent, screen } from '@testing-library/react';
import Rule from '..';
import { getBySelector } from '../../../testUtils/customQuery';
import { renderWithTheme } from '../../../testUtils/customRender';
import {
  mockDriver,
  mockUseGlobalRuleTemplate,
  mockUseProject,
  mockUseRuleTemplate,
} from '../../../testUtils/mockRequest';
import {
  mockGetAllRules,
  mockGetGlobalTemplateRules,
  mockGetProjectTemplateRules,
} from './utils';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

const clickSelectOption = async (id: string, value: string) => {
  fireEvent.mouseDown(getBySelector('input', screen.getByTestId(id)));
  await act(async () => jest.advanceTimersByTime(0));

  const allOptions = screen.getAllByText(value);
  const option = allOptions[1];
  expect(option).toHaveClass('ant-select-item-option-content');
  fireEvent.click(option);
};

describe('test Rule', () => {
  let getProjectRuleTemplateSpy: jest.SpyInstance;
  let getRuleTemplateSpy: jest.SpyInstance;
  let getRuleListSpy: jest.SpyInstance;
  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    mockDriver();
    mockUseProject();
    mockUseRuleTemplate();
    mockUseGlobalRuleTemplate();
    getProjectRuleTemplateSpy = mockGetProjectTemplateRules();
    getRuleTemplateSpy = mockGetGlobalTemplateRules();
    getRuleListSpy = mockGetAllRules();

    useLocationMock.mockReturnValue({
      pathname: '/rule',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithTheme(<Rule />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should render rules by select database type', async () => {
    renderWithTheme(<Rule />);

    expect(getRuleListSpy).toBeCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getRuleListSpy).toBeCalledTimes(1);
    expect(getRuleListSpy).toBeCalledWith({
      filter_db_type: 'oracle',
    });

    fireEvent.mouseDown(
      getBySelector('input', screen.getByTestId('database-type'))
    );
    await act(async () => jest.advanceTimersByTime(0));

    const allOptions = screen.getAllByText('mysql');
    const option = allOptions[1];
    expect(option).toHaveClass('ant-select-item-option-content');
    fireEvent.click(option);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getRuleListSpy).toBeCalledTimes(2);
    expect(getRuleListSpy).toBeCalledWith({
      filter_db_type: 'mysql',
    });
  });

  test('should call get rule request with filter rule template', async () => {
    const { container } = renderWithTheme(<Rule />);

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getRuleListSpy).toBeCalledTimes(1);
    expect(getProjectRuleTemplateSpy).toBeCalledTimes(0);
    expect(getRuleTemplateSpy).toBeCalledTimes(0);

    await clickSelectOption('rule-template-name', 'global_rule_template_name1');

    expect(getRuleListSpy).toBeCalledTimes(1);
    expect(getProjectRuleTemplateSpy).toBeCalledTimes(0);
    expect(getRuleTemplateSpy).toBeCalledTimes(1);
    expect(getRuleTemplateSpy).toBeCalledWith({
      rule_template_name: 'global_rule_template_name1',
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('Oracle')).toHaveClass('ant-select-selection-item');
    expect(screen.getByTestId('database-type')).toHaveClass(
      'ant-select-disabled'
    );

    expect(getRuleListSpy).toBeCalledTimes(2);
    expect(getRuleListSpy).toBeCalledWith({
      filter_db_type: 'Oracle',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();

    await clickSelectOption('project-name', 'project_name_1');
    await act(async () => jest.advanceTimersByTime(3000));

    await clickSelectOption('rule-template-name', 'rule_template_name1');
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('MySQL')).toHaveClass('ant-select-selection-item');
    expect(screen.getByTestId('database-type')).toHaveClass(
      'ant-select-disabled'
    );

    expect(getRuleListSpy).toBeCalledTimes(3);
    expect(getRuleListSpy).toBeCalledWith({
      filter_db_type: 'MySQL',
    });

    expect(getProjectRuleTemplateSpy).toBeCalledTimes(1);
    expect(getRuleTemplateSpy).toBeCalledTimes(1);
    expect(getProjectRuleTemplateSpy).toBeCalledWith({
      rule_template_name: 'rule_template_name1',
      project_name: 'project_name_1',
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
