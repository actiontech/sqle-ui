import { fireEvent, waitFor, screen, act } from '@testing-library/react';
import Rule from '.';
import instance from '../../api/instance';
import rule_template from '../../api/rule_template';
import {
  getBySelector,
  selectOptionByIndex,
} from '../../testUtils/customQuery';
import { renderWithTheme } from '../../testUtils/customRender';
import {
  mockDriver,
  mockUseInstance,
  mockUseProject,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';
import { allRulesWithType, instanceRule } from './__testData__';

describe.skip('Rule', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseInstance();
    mockDriver();
    mockUseProject();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockGetAllRules = () => {
    const spy = jest.spyOn(rule_template, 'getRuleListV1');
    spy.mockImplementation((params) => {
      const temp = allRulesWithType.filter(
        (item) => item.db_type === params.filter_db_type
      );
      return resolveThreeSecond(temp);
    });
    return spy;
  };

  const mockGetInstanceRules = () => {
    const spy = jest.spyOn(instance, 'getInstanceRuleListV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceRule));
    return spy;
  };

  const mockGetInstanceDetail = () => {
    const spy = jest.spyOn(instance, 'getInstanceV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        instance_name: 'db1',
        db_host: '20.20.20.2',
        db_port: '3306',
        db_user: 'root',
        db_type: 'mysql',
        desc: '',
        workflow_template_name: 'workflow-template-name-1',
      })
    );
    return spy;
  };

  test('should render page header', async () => {
    mockGetAllRules();
    const { container } = renderWithTheme(<Rule />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should render rules by select database type', async () => {
    mockGetAllRules();
    const { container } = renderWithTheme(<Rule />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
    fireEvent.mouseDown(
      getBySelector('input', screen.getByTestId('database-type'))
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const allOptions = screen.getAllByText('mysql');
    const option = allOptions[1];
    expect(option).toHaveClass('ant-select-item-option-content');
    fireEvent.click(option);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should render instance rule when user select a instance', async () => {
    const getAllRulesSpy = mockGetAllRules();
    const getInstanceDetailSpy = mockGetInstanceDetail();
    const getInstanceRuleSpy = mockGetInstanceRules();
    const { container } = renderWithTheme(<Rule />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByLabelText('rule.form.instance')).toBeInTheDocument();
    expect(screen.queryByLabelText('rule.form.instance')).toBeDisabled();
    selectOptionByIndex('rule.form.project', 'project_name_1');

    expect(screen.queryByLabelText('rule.form.instance')).not.toBeDisabled();
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
    expect(getInstanceDetailSpy).toBeCalledTimes(1);
    expect(getInstanceDetailSpy).toBeCalledWith({ instance_name: 'instance1' });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getInstanceRuleSpy).toBeCalledTimes(1);
    expect(getInstanceRuleSpy).toBeCalledWith({
      instance_name: 'instance1',
      project_name: 'project_name_1',
    });
    expect(getAllRulesSpy).toBeCalledTimes(2);
    expect(getAllRulesSpy).toBeCalledWith({ filter_db_type: 'mysql' });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
