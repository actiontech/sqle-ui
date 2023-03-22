import { waitFor, screen, fireEvent, cleanup } from '@testing-library/react';
import { Modal } from 'antd';
import { useParams } from 'react-router-dom';
import DataSourceList from '.';
import instance from '../../../api/instance';
import { SystemRole } from '../../../data/common';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseRole,
  mockUseRuleTemplate,
  resolveThreeSecond,
  mockDriver,
  mockUseGlobalRuleTemplate,
} from '../../../testUtils/mockRequest';
import { dataSourceList } from '../__testData__';
import { createMemoryHistory } from 'history';
import { getBySelector } from '../../../testUtils/customQuery';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = mockBindProjects[0].project_name;

describe('DataSource/DataSourceList', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockGetInstance();
    mockUseRuleTemplate();
    mockUseRole();
    mockUseInstance();
    mockDriver();
    mockUseGlobalRuleTemplate();
    useParamsMock.mockReturnValue({ projectName });
    mockUseSelector({
      user: { role: SystemRole.admin, bindProjects: mockBindProjects },
      projectManage: { archived: false },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetInstance = () => {
    const spy = jest.spyOn(instance, 'getInstanceListV2');
    spy.mockImplementation(() =>
      resolveThreeSecond(dataSourceList, { otherData: { total_nums: 1 } })
    );
    return spy;
  };

  test('should match snapshot', async () => {
    const getInstanceSpy = mockGetInstance();
    const { container } = renderWithRouter(<DataSourceList />);
    expect(getInstanceSpy).toBeCalledTimes(1);
    expect(getInstanceSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should delete data source when user click delete data source button', async () => {
    const getInstanceSpy = mockGetInstance();
    renderWithRouter(<DataSourceList />);
    expect(getInstanceSpy).toBeCalledTimes(1);

    const deleteSpy = jest.spyOn(instance, 'deleteInstanceV1');
    deleteSpy.mockImplementation(() => resolveThreeSecond({}));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getAllByText('common.delete')[0]);
    expect(
      screen.queryByText('dataSource.deleteDatabase.confirmMessage')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(
      screen.queryByText('dataSource.deleteDatabase.deletingDatabase')
    ).toBeInTheDocument();
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({
      project_name: projectName,
      instance_name: dataSourceList[0].instance_name,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('dataSource.deleteDatabase.deletingDatabase')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('dataSource.deleteDatabase.deleteSuccessTips')
    ).toBeInTheDocument();
    expect(getInstanceSpy).toBeCalledTimes(2);
  });

  test('should send test database connect request when user click test database connectable button', async () => {
    renderWithRouter(<DataSourceList />);
    const checkInstanceConnectable = jest.spyOn(
      instance,
      'checkInstanceIsConnectableByNameV1'
    );
    checkInstanceConnectable.mockImplementation(() =>
      resolveThreeSecond({
        is_instance_connectable: true,
      })
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseEnter(screen.getAllByText('common.more')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.click(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
    );
    expect(
      screen.queryByText('dataSource.dataSourceForm.testing')
    ).toBeInTheDocument();
    expect(checkInstanceConnectable).toBeCalledTimes(1);
    expect(checkInstanceConnectable).toBeCalledWith({
      project_name: projectName,
      instance_name: dataSourceList[0].instance_name,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('dataSource.dataSourceForm.testing')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('dataSource.dataSourceForm.testSuccess')
    ).toBeInTheDocument();
  });

  test('should show the reason of test failed when database is can not connect', async () => {
    renderWithRouter(<DataSourceList />);
    const ModalErrorSpy = jest.spyOn(Modal, 'error');
    const checkInstanceConnectable = jest.spyOn(
      instance,
      'checkInstanceIsConnectableByNameV1'
    );
    checkInstanceConnectable.mockImplementation(() =>
      resolveThreeSecond({
        is_instance_connectable: false,
        connect_error_message: 'can not connect',
      })
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseEnter(screen.getAllByText('common.more')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.click(
      screen.getByText('dataSource.dataSourceForm.testDatabaseConnection')
    );
    expect(
      screen.queryByText('dataSource.dataSourceForm.testing')
    ).toBeInTheDocument();
    expect(checkInstanceConnectable).toBeCalledTimes(1);
    expect(checkInstanceConnectable).toBeCalledWith({
      project_name: projectName,
      instance_name: dataSourceList[0].instance_name,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('dataSource.dataSourceForm.testing')
    ).not.toBeInTheDocument();
    expect(ModalErrorSpy).toBeCalledTimes(1);
    expect(ModalErrorSpy).toBeCalledWith({
      title: 'dataSource.testConnectModal.errorTitle',
      content: 'can not connect',
    });
  });

  test('should hide the Create, Add, Edit feature when not currently a project manager or admin', async () => {
    mockUseSelector({
      user: {
        role: SystemRole.admin,
        bindProjects: [{ projectName: 'test', isManager: false }],
      },
      projectManage: { archived: false },
    });

    renderWithRouter(<DataSourceList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('common.edit')[0]).toBeInTheDocument();
    expect(
      screen.queryAllByText('dataSource.addDatabase')[0]
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      user: {
        role: '',
        bindProjects: mockBindProjects,
      },
      projectManage: { archived: false },
    });
    renderWithRouter(<DataSourceList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('common.edit')[0]).toBeInTheDocument();
    expect(screen.queryByText('dataSource.addDatabase')).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      user: {
        role: '',
        bindProjects: [{ projectName: 'default', isManager: false }],
      },
      projectManage: { archived: false },
    });
    renderWithRouter(<DataSourceList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).toBeUndefined();
    expect(screen.queryAllByText('common.edit')[0]).toBeUndefined();
    expect(
      screen.queryByText('dataSource.addDatabase')
    ).not.toBeInTheDocument();
  });

  test('should jump to next page when user click next page button', async () => {
    const getInstanceSpy = mockGetInstance();
    getInstanceSpy.mockImplementation(() =>
      resolveThreeSecond(
        Array.from({ length: 11 }, (_, i) => ({
          ...dataSourceList[0],
          instance_name: `instance_name_${i}`,
        })),
        { otherData: { total_nums: 11 } }
      )
    );
    renderWithRouter(<DataSourceList />);
    expect(getInstanceSpy).nthCalledWith(1, {
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(getBySelector('.ant-pagination-next'));
    expect(getInstanceSpy).nthCalledWith(2, {
      page_index: 2,
      page_size: 10,
      project_name: projectName,
    });
    fireEvent.click(getBySelector('.ant-pagination-prev'));
    expect(getInstanceSpy).nthCalledWith(3, {
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
    expect(getInstanceSpy).toBeCalledTimes(3);
  });

  test('should render rule link when rule template name is not empty', async () => {
    let history = createMemoryHistory();
    renderWithServerRouter(<DataSourceList />, undefined, { history });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText(dataSourceList[0].rule_template?.name!));
    expect(history.location.pathname).toBe('/rule');
    expect(history.location.search).toBe('?ruleTemplateName=default');

    fireEvent.click(screen.getByText(dataSourceList[1].rule_template?.name!));
    expect(history.location.pathname).toBe('/rule');
    expect(history.location.search).toBe(
      '?projectName=default&ruleTemplateName=test'
    );
  });

  test('should hide the Create, Delete, Edit feature when project is archived', async () => {
    mockUseSelector({
      user: {
        role: SystemRole.admin,
        bindProjects: [{ projectName: projectName, isManager: true }],
      },
      projectManage: { archived: true },
    });

    renderWithRouter(<DataSourceList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).toBeUndefined();
    expect(screen.queryAllByText('common.edit')[0]).toBeUndefined();
    expect(
      screen.queryByText('dataSource.addDatabase')
    ).not.toBeInTheDocument();
  });
});
