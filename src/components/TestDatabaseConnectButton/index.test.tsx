import TestDatabaseConnectButton from '.';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

describe('TestDatabaseConnectButton', () => {
  const buttonText = 'dataSource.dataSourceForm.testDatabaseConnection';

  describe('uncontrolled mode', () => {
    test('should render message by initHide', () => {
      const { container, rerender } = render(
        <TestDatabaseConnectButton
          onClickTestButton={jest.fn}
          loading={true}
          connectAble={true}
        />
      );
      expect(container).toMatchSnapshot();

      rerender(
        <TestDatabaseConnectButton
          onClickTestButton={jest.fn}
          loading={false}
          connectAble={true}
        />
      );

      expect(container).toMatchSnapshot();
    });

    test('should show connect result when click the test button', () => {
      const handleClickButton = jest.fn();
      const { container, rerender } = render(
        <TestDatabaseConnectButton
          onClickTestButton={handleClickButton}
          loading={true}
          connectAble={true}
        />
      );
      fireEvent.click(screen.getByText(buttonText));
      expect(handleClickButton).not.toBeCalled();

      rerender(
        <TestDatabaseConnectButton
          onClickTestButton={handleClickButton}
          loading={false}
          connectAble={true}
        />
      );
      expect(container).toMatchSnapshot();
      fireEvent.click(screen.getByText(buttonText));
      expect(handleClickButton).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();

      handleClickButton.mockClear();
      cleanup();

      const { container: disableContainer } = render(
        <TestDatabaseConnectButton
          onClickTestButton={handleClickButton}
          loading={false}
          connectAble={false}
          connectDisableReason="disable reason"
        />
      );
      expect(disableContainer).toMatchSnapshot();
      fireEvent.click(screen.getByText(buttonText));
      expect(handleClickButton).toBeCalledTimes(1);
      expect(disableContainer).toMatchSnapshot();
    });
  });

  describe('controlled mode', () => {
    test('should render message by initHide', () => {
      const { container, rerender } = render(
        <TestDatabaseConnectButton
          onClickTestButton={jest.fn}
          initHide={true}
          loading={false}
          connectAble={false}
        />
      );
      expect(container).toMatchSnapshot();

      rerender(
        <TestDatabaseConnectButton
          onClickTestButton={jest.fn}
          initHide={true}
          loading={true}
          connectAble={false}
        />
      );

      expect(container).toMatchSnapshot();

      rerender(
        <TestDatabaseConnectButton
          onClickTestButton={jest.fn}
          initHide={false}
          loading={true}
          connectAble={false}
          connectDisableReason="disable reason"
        />
      );

      expect(container).toMatchSnapshot();

      rerender(
        <TestDatabaseConnectButton
          onClickTestButton={jest.fn}
          initHide={false}
          loading={false}
          connectAble={true}
          connectDisableReason="disable reason"
        />
      );

      expect(container).toMatchSnapshot();

      rerender(
        <TestDatabaseConnectButton
          onClickTestButton={jest.fn}
          initHide={false}
          loading={false}
          connectAble={false}
          connectDisableReason="disable reason"
        />
      );

      expect(container).toMatchSnapshot();
    });

    test('should call onClickTestButton when click the test button', () => {
      const handleClickTestButton = jest.fn();
      const { container } = render(
        <TestDatabaseConnectButton
          onClickTestButton={handleClickTestButton}
          initHide={true}
          loading={false}
          connectAble={false}
          connectDisableReason="disable reason"
        />
      );
      expect(container).toMatchSnapshot();
      fireEvent.click(screen.getByText(buttonText));
      expect(handleClickTestButton).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });
  });
});
