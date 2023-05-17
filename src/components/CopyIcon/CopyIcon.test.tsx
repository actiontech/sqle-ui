import { fireEvent, render, screen } from '@testing-library/react';
import CopyIcon from './index';
import { getAllBySelector } from '../../testUtils/customQuery';
import Copy from '../../utils/Copy';
import { act } from 'react-dom/test-utils';

describe('test CopyIcon', () => {
  let copySpy: jest.SpyInstance;
  beforeEach(() => {
    document.execCommand = jest.fn();
    jest.spyOn(document, 'execCommand');
    copySpy = jest.spyOn(Copy, 'copyText');
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  test('should match snapshot', () => {
    const { baseElement } = render(<CopyIcon />);
    expect(baseElement).toMatchSnapshot();
  });

  test('the first parameter of onCopy is the click event', async () => {
    function onCopy(e?: React.MouseEvent<HTMLDivElement>) {
      expect(e).not.toBeUndefined();
      expect(copySpy).toBeCalledTimes(1);
      expect(copySpy).nthCalledWith(1, 'text');
    }

    render(<CopyIcon onCopy={onCopy} text="text" />);
    fireEvent.click(getAllBySelector('.actiontech-copy')[0]);

    await act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(getAllBySelector('.actiontech-copy-success')[0]).not.toBeUndefined();

    fireEvent.mouseEnter(getAllBySelector('.actiontech-copy-success')[0]);

    await screen.findByText('common.copied');

    await act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getAllBySelector('.actiontech-copy')[0]).not.toBeUndefined();
  });

  test('render custom title', async () => {
    const { rerender } = render(<CopyIcon tooltips={false} />);

    fireEvent.click(getAllBySelector('.actiontech-copy')[0]);
    expect(copySpy).nthCalledWith(1, '');

    await act(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.mouseEnter(getAllBySelector('.actiontech-copy-success')[0]);

    expect(screen.queryByText('common.copied')).not.toBeInTheDocument();

    rerender(<CopyIcon tooltips="custom title">text</CopyIcon>);

    expect(screen.queryByText('custom title')).not.toBeInTheDocument();

    fireEvent.click(getAllBySelector('.actiontech-copy')[0]);
    expect(copySpy).nthCalledWith(2, 'text');
    await act(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.mouseEnter(getAllBySelector('.actiontech-copy-success')[0]);

    await screen.findByText('custom title');
  });
});
