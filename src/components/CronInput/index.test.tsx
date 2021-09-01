import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import CronInput from '.';
import { getBySelector } from '../../testUtils/customQuery';
import { CronMode } from './index.type';

describe('CronInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should render input with "* * * * *" value by default', () => {
    const { container } = render(<CronInput />);
    expect(container).toMatchSnapshot();
  });

  test('should switch cron mode when user select cron mode', () => {
    const { container } = render(<CronInput />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.cron.mode.manual'));
    expect(container).toMatchSnapshot();
  });

  test('should switch cron mode when component controller mode', () => {
    const { container, rerender } = render(
      <CronInput mode={CronMode.Manual} />
    );
    expect(container).toMatchSnapshot();
    rerender(<CronInput mode={CronMode.Select} />);
    expect(container).toMatchSnapshot();
  });

  test('should hide the a part of select when user pass default every value', () => {
    const { container, rerender } = render(<CronInput everyDefault="year" />);
    expect(container).toMatchSnapshot();
    rerender(<CronInput everyDefault="month" />);
    expect(container).toMatchSnapshot();
    rerender(<CronInput everyDefault="day" />);
    expect(container).toMatchSnapshot();
    rerender(<CronInput everyDefault="week" />);
    expect(container).toMatchSnapshot();
    rerender(<CronInput everyDefault="hour" />);
    expect(container).toMatchSnapshot();
    rerender(<CronInput everyDefault="minute" />);
    expect(container).toMatchSnapshot();
  });

  test('should hide the a part of select when user change every select', async () => {
    const { container } = render(<CronInput everyDefault="year" />);
    expect(container).toMatchSnapshot();

    fireEvent.mouseDown(screen.getByText('common.time.year'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const hourOptions = screen.getAllByText('common.time.hour');
    const hour = hourOptions[0];
    expect(hour).toHaveClass('ant-select-item-option-content');
    fireEvent.click(hour);
    expect(container).toMatchSnapshot();
  });

  test('should update cron expression when user change every', async () => {
    const onChangeMock = jest.fn();
    const { container } = render(
      <CronInput everyDefault="year" onChange={onChangeMock} />
    );
    expect(container).toMatchSnapshot();

    onChangeMock.mockClear();

    fireEvent.mouseDown(screen.getByText('common.time.percommon.time.month'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const monthOptions = screen.getAllByText('1');
    const month = monthOptions[1];
    expect(month).toHaveClass('ant-select-item-option-content');
    fireEvent.click(month);

    expect(onChangeMock).toBeCalledTimes(1);
    expect(onChangeMock).toBeCalledWith('* * * 1 *');

    fireEvent.mouseDown(screen.getByText('common.time.year'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const hourOptions = screen.getAllByText('common.time.hour');
    const hour = hourOptions[0];
    expect(hour).toHaveClass('ant-select-item-option-content');
    fireEvent.click(hour);

    expect(container).toMatchSnapshot();
  });

  test('should call update cron mode of props when user pass this prop and mode props', async () => {
    const modeChangeMock = jest.fn();
    const { container } = render(
      <CronInput mode={CronMode.Select} modeChange={modeChangeMock} />
    );
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.cron.mode.manual'));
    expect(modeChangeMock).toBeCalledTimes(1);
    expect(modeChangeMock).toBeCalledWith(CronMode.Manual);
    expect(container).toMatchSnapshot();
  });

  test('should update error message when user input error cron expression', async () => {
    const updateErrorMessageMock = jest.fn();
    render(<CronInput updateErrorMessage={updateErrorMessageMock} />);
    fireEvent.click(screen.getByText('common.cron.mode.manual'));
    updateErrorMessageMock.mockClear();
    fireEvent.input(
      getBySelector('input', getBySelector('.cron-user-manual')),
      { target: { value: '* * * *' } }
    );
    expect(updateErrorMessageMock).toBeCalledTimes(1);
    expect(updateErrorMessageMock).toBeCalledWith(
      'common.cron.errorMessage.lenMustBeFive'
    );
  });

  test('should set value to equal props.value', async () => {
    const { container } = render(<CronInput value="1 1 1 1 1" />);
    expect(container).toMatchSnapshot();
  });
});
