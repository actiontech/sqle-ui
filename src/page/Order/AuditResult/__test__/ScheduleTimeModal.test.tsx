import {
  act,
  fireEvent,
  getByLabelText,
  render,
  screen,
} from '@testing-library/react';
import moment from 'moment';
import { IMaintenanceTimeResV1 } from '../../../../api/common';
import { getBySelector } from '../../../../testUtils/customQuery';
import ScheduleTimeModal from '../ScheduleTimeModal';

const maintenanceTime: IMaintenanceTimeResV1[] = [];

describe('Order/AuditResult/ScheduleTimeModal', () => {
  const mockCloseScheduleModal = jest.fn();
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockSubmit.mockImplementation(
      () =>
        new Promise((res) => {
          setTimeout(() => {
            res(null);
          }, 3000);
        })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should match snapshot', () => {
    const { baseElement } = render(
      <ScheduleTimeModal
        visible={true}
        closeScheduleModal={mockCloseScheduleModal}
        maintenanceTime={maintenanceTime}
        submit={mockSubmit}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });

  test('should be called submit when clicking confirm button', async () => {
    render(
      <ScheduleTimeModal
        visible={true}
        closeScheduleModal={mockCloseScheduleModal}
        maintenanceTime={maintenanceTime}
        submit={mockSubmit}
      />
    );

    expect(
      screen.getAllByText('order.operator.onlineRegularly')[0]
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(
        screen.queryAllByText('order.operator.onlineRegularly')[0]
      );
    });
    expect(getBySelector('.ant-modal')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#schedule_time'));
    fireEvent.input(getBySelector('#schedule_time'), {
      target: {
        value: moment()
          .add(1, 'd')
          .hour(0)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DD HH:mm:ss')
          .toString(),
      },
    });
    await act(async () => {
      fireEvent.click(
        getBySelector('.ant-btn-primary', getBySelector('.ant-picker-footer'))
      );
    });

    expect(mockSubmit).toBeCalledTimes(0);
    expect(screen.getByTestId('confirm-button')).toHaveTextContent(
      'order.operator.onlineRegularly'
    );
    expect(getBySelector('#schedule_time')).toHaveValue(
      moment()
        .add(1, 'd')
        .hour(0)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DD HH:mm:ss')
        .toString()
    );
    fireEvent.click(screen.getByTestId('confirm-button'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(mockSubmit).toBeCalledTimes(1);
    expect(screen.getByTestId('confirm-button')).toHaveClass('ant-btn-loading');
    expect(mockSubmit).toBeCalledWith(
      moment()
        .add(1, 'd')
        .hour(0)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DDTHH:mm:ssZ')
        .toString()
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByTestId('confirm-button')).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(mockCloseScheduleModal).toBeCalledTimes(1);
    expect(getBySelector('#schedule_time')).toHaveValue('');
  });

  test('only can select maintenance time when user want to set schedule time', async () => {
    render(
      <ScheduleTimeModal
        visible={true}
        closeScheduleModal={mockCloseScheduleModal}
        submit={mockSubmit}
        maintenanceTime={[
          {
            maintenance_start_time: { hour: 0, minute: 0 },
            maintenance_stop_time: { hour: 10, minute: 0 },
          },
          {
            maintenance_start_time: { hour: 12, minute: 0 },
            maintenance_stop_time: { hour: 20, minute: 0 },
          },
        ]}
      />
    );

    fireEvent.click(getBySelector('.ant-picker'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(getBySelector('.ant-picker-datetime-panel')).toMatchSnapshot();
  });

  test('user should set any time when maintenanceTime is empty', async () => {
    const nowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('2022-06-29').getTime());

    render(
      <ScheduleTimeModal
        visible={true}
        closeScheduleModal={mockCloseScheduleModal}
        submit={mockSubmit}
      />
    );

    fireEvent.click(getBySelector('.ant-picker'));

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getAllByText('30')[1]);
    await act(async () => jest.advanceTimersByTime(0));

    expect(getBySelector('.ant-picker-time-panel')).toMatchSnapshot();
    nowSpy.mockRestore();
  });

  test('should throw error when user only click today', async () => {
    render(
      <ScheduleTimeModal
        visible={true}
        closeScheduleModal={mockCloseScheduleModal}
        submit={mockSubmit}
      />
    );

    const warnSpy = jest.spyOn(console, 'warn');
    warnSpy.mockImplementation(() => void 0);
    fireEvent.mouseDown(getBySelector('#schedule_time'));
    fireEvent.click(screen.getAllByText('00')[2]);
    fireEvent.click(screen.getByText('OK'));
    await act(async () => {
      return jest.runOnlyPendingTimers();
    });
    expect(warnSpy).toBeCalledTimes(1);
    expect(warnSpy).toBeCalledWith('async-validator:', [
      'order.operator.execScheduledBeforeNow',
    ]);
    warnSpy.mockRestore();
  });
});
