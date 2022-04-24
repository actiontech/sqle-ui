import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import CronInput from '.';
import { getBySelector } from '../../testUtils/customQuery';
import { CronMode, CronTimeValue } from './index.type';

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
    const { container, rerender } = render(
      <CronInput everyDefault={CronTimeValue.everyDay} />
    );
    expect(container).toMatchSnapshot();
    rerender(<CronInput />);
    expect(container).toMatchSnapshot();
    rerender(<CronInput everyDefault={CronTimeValue.everyWeek} />);
    expect(container).toMatchSnapshot();
  });
  test('should update cron expression when user change week', async () => {
    const onChangeMock = jest.fn();
    const { container } = render(<CronInput onChange={onChangeMock} />);
    expect(container).toMatchSnapshot();

    onChangeMock.mockClear();
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.mouseDown(screen.getAllByText('common.cron.time.everyDay')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const weekOptions = screen.getAllByText('common.cron.time.everyWeek');
    const week = weekOptions[0];
    expect(week).toHaveClass('ant-select-item-option-content');
    fireEvent.click(week);

    fireEvent.click(screen.getByText('common.week.tuesday'));

    expect(onChangeMock).toBeCalledTimes(1);
    expect(onChangeMock).toBeCalledWith('* * * * 2');

    fireEvent.click(screen.getByText('common.week.friday'));

    expect(onChangeMock).toBeCalledTimes(2);
    expect(onChangeMock).nthCalledWith(2, '* * * * 2,5');

    fireEvent.click(screen.getByText('common.week.sunday'));

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

  test('should disable select mode when user input month in cron expression', async () => {
    render(<CronInput />);
    fireEvent.click(screen.getByText('common.cron.mode.manual'));
    fireEvent.input(
      getBySelector('input', getBySelector('.cron-user-manual')),
      { target: { value: '* * * 1 *' } }
    );
    expect(screen.getByText('common.cron.mode.select').parentNode).toHaveClass(
      'ant-radio-wrapper-disabled'
    );
  });

  test('should set week to * when user change interval from every week to every day', async () => {
    render(<CronInput />);
    fireEvent.mouseDown(screen.getAllByText('common.cron.time.everyDay')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const weekOptions = screen.getAllByText('common.cron.time.everyWeek');
    const week = weekOptions[0];
    expect(week).toHaveClass('ant-select-item-option-content');
    fireEvent.click(week);

    fireEvent.click(screen.getByText('common.week.tuesday'));

    expect(screen.getByTestId('cron-preview')).toHaveTextContent(
      'common.preview: * * * * 2'
    );

    fireEvent.mouseDown(screen.getAllByText('common.cron.time.everyWeek')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const dayOptions = screen.getAllByText('common.cron.time.everyDay');
    const day = dayOptions[0];
    expect(day).toHaveClass('ant-select-item-option-content');
    fireEvent.click(day);

    expect(screen.getByTestId('cron-preview')).toHaveTextContent(
      'common.preview: * * * * *'
    );
  });

  test('should switch to every week when cron include week at user switch cron mode', async () => {
    render(<CronInput />);
    fireEvent.click(screen.getByText('common.cron.mode.manual'));
    fireEvent.input(
      getBySelector('input', getBySelector('.cron-user-manual')),
      { target: { value: '* * * * 2' } }
    );
    fireEvent.click(screen.getByText('common.cron.mode.select'));
    expect(screen.getByText('common.cron.time.everyWeek')).toHaveClass(
      'ant-select-selection-item'
    );
  });
});
