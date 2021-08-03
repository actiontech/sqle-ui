import { waitFor, screen, fireEvent } from '@testing-library/react';
import { Modal } from 'antd';
import DataSourceList from '.';
import instance from '../../../api/instance';
import { renderWithRouter } from '../../../testUtils/customRender';
import {
  mockUseInstance,
  mockUseRole,
  mockUseRuleTemplate,
  resolveThreeSecond,
  mockDriver,
} from '../../../testUtils/mockRequest';
import { dataSourceList } from '../__testData__';

describe('DataSource/DataSourceList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetInstance();
    mockUseRuleTemplate();
    mockUseRole();
    mockUseInstance();
    mockDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetInstance = () => {
    const spy = jest.spyOn(instance, 'getInstanceListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(dataSourceList, { otherData: { total_nums: 1 } })
    );
    return spy;
  };

  test('should match snapshot', async () => {
    const getInstanceSpy = mockGetInstance();
    const { container } = renderWithRouter(<DataSourceList />);
    expect(getInstanceSpy).toBeCalledTimes(1);
    expect(getInstanceSpy).toBeCalledWith({ page_index: 1, page_size: 10 });
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should delete data source when user click delete data source button', async () => {
    renderWithRouter(<DataSourceList />);
    const deleteSpy = jest.spyOn(instance, 'deleteInstanceV1');
    deleteSpy.mockImplementation(() => resolveThreeSecond({}));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('common.delete'));
    expect(
      screen.queryByText('dataSource.deleteDatabase.confirmMessage')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(
      screen.queryByText('dataSource.deleteDatabase.deletingDatabase')
    ).toBeInTheDocument();
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({
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
    fireEvent.mouseEnter(screen.getByText('common.more'));
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
    fireEvent.mouseEnter(screen.getByText('common.more'));
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
});
