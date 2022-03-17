import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector,
} from '../../../../testUtils/customQuery';
import MaintenanceTimePicker from './MaintenanceTimePicker';

describe('MaintenanceTimePicker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const value = [
    {
      startTime: {
        hour: 23,
        minute: 0,
      },
      endTime: {
        hour: 23,
        minute: 59,
      },
    },
    {
      startTime: {
        hour: 0,
        minute: 0,
      },
      endTime: {
        hour: 2,
        minute: 30,
      },
    },
  ];

  it('should render defalut node whne value is undefined or value length is zero', async () => {
    const { container } = render(<MaintenanceTimePicker value={undefined} />);
    expect(container).toMatchSnapshot();
  });

  it('should render time when value is not empty', async () => {
    const { container } = render(<MaintenanceTimePicker value={value} />);
    expect(container).toMatchSnapshot();
  });

  it('should remove value when use click remove icon', async () => {
    const onChange = jest.fn();
    render(<MaintenanceTimePicker value={value} onChange={onChange} />);
    fireEvent.click(getAllBySelector('.ant-tag-close-icon')[0]);
    expect(onChange).toBeCalledWith(value.slice(1));
  });

  it('should add value when use add time', async () => {
    const onChange = jest.fn();
    render(<MaintenanceTimePicker onChange={onChange} />);
    fireEvent.click(screen.getByText('common.add'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(getBySelector('.ant-picker-range'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getAllByText('23')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getAllByText('02')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.ok'));
    expect(onChange).toBeCalledWith([
      {
        endTime: {
          hour: 23,
          minute: 0,
        },
        startTime: {
          hour: 2,
          minute: 0,
        },
      },
    ]);
  });
});
