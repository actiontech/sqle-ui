import { fireEvent, render, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import { SupportTheme } from '../../../../../theme';
import MoreAction from '../MoreAction';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from '../../../../../hooks/useNavigate';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  };
});

jest.mock('../../../../../hooks/useNavigate', () => jest.fn());

describe('test Nav/Header/MoreAction', () => {
  const dispatchMock = jest.fn();
  const mockNavigate = jest.fn();

  const useSelectorMock: jest.Mock = useSelector as jest.Mock;
  const useDispatchMock: jest.Mock = useDispatch as jest.Mock;
  const useNavigateMock: jest.Mock = useNavigate as jest.Mock;

  beforeEach(() => {
    useSelectorMock.mockImplementation((selector) => {
      return selector({
        user: { username: 'admin', theme: SupportTheme.LIGHT, role: 'admin' },
      });
    });
    useDispatchMock.mockImplementation(() => dispatchMock);
    useNavigateMock.mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    dispatchMock.mockClear();
    jest.clearAllMocks();
  });

  test('should match snapshot', async () => {
    const { baseElement, rerender } = render(<MoreAction />);
    fireEvent.mouseEnter(screen.getByTestId('more-action-icon'));

    await screen.findByText('system.log.version');
    expect(baseElement).toMatchSnapshot();

    useSelectorMock.mockImplementation((selector) => {
      return selector({
        user: { username: 'test', role: 'role' },
      });
    });
    rerender(<MoreAction />);

    fireEvent.mouseEnter(screen.getByTestId('more-action-icon'));

    await screen.findByText('system.log.version');
    expect(baseElement).toMatchSnapshot();
  });

  test('should opened version info modal when clicking "system.log.version"', async () => {
    render(<MoreAction />);
    fireEvent.mouseEnter(screen.getByTestId('more-action-icon'));

    await screen.findByText('system.log.version');
    expect(dispatchMock).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('system.log.version'));
    expect(dispatchMock).toBeCalledTimes(1);
    expect(dispatchMock).toBeCalledWith({
      payload: { modalName: ModalName.SHOW_VERSION, status: true },
      type: 'nav/updateModalStatus',
    });
  });

  test('should jump to path when clicking menu item', async () => {
    render(<MoreAction />);

    fireEvent.mouseEnter(screen.getByTestId('more-action-icon'));

    await screen.findByText('system.log.version');

    fireEvent.click(screen.getByText('menu.reportStatistics'));
    expect(mockNavigate).nthCalledWith(1, 'reportStatistics');
    expect(mockNavigate).toBeCalledTimes(1);

    fireEvent.click(screen.getByText('menu.userCenter'));
    expect(mockNavigate).nthCalledWith(2, 'userCenter');
    expect(mockNavigate).toBeCalledTimes(2);

    fireEvent.click(screen.getByText('menu.ruleManager'));
    expect(mockNavigate).nthCalledWith(3, 'rule/template');
    expect(mockNavigate).toBeCalledTimes(3);

    fireEvent.click(screen.getByText('menu.systemSetting'));
    expect(mockNavigate).nthCalledWith(4, 'system');
    expect(mockNavigate).toBeCalledTimes(4);
  });
});
