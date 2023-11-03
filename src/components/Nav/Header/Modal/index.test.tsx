import { render, act } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import InfoModalManager from '.';
import global from '../../../../api/global';
import { ModalName } from '../../../../data/ModalName';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import companyNotice from '../../../../api/companyNotice';
import { SupportTheme } from '../../../../theme';
import { mockBindProjects } from '../../../../hooks/useCurrentUser/index.test.data';

const serverVersion = `"issue_201 b1c2baedcb37f27feb7cef34f088212938fad1ba"`;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('test Nav/Header/Modal', () => {
  const scopeDispatch = jest.fn();

  const mockGetSQLEInfo = () => {
    const spy = jest.spyOn(global, 'getSQLEInfoV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({ version: serverVersion })
    );
    return spy;
  };

  const mockGetCompanyNotice = () => {
    const spy = jest.spyOn(companyNotice, 'getCompanyNotice');
    spy.mockImplementation(() => resolveThreeSecond({ notice_str: '' }));
    return spy;
  };

  beforeEach(() => {
    mockGetSQLEInfo();
    mockGetCompanyNotice();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          username: 'admin',
          theme: SupportTheme.LIGHT,
          bindProjects: mockBindProjects,
        },
        nav: {
          modalStatus: {
            [ModalName.SHOW_VERSION]: true,
            [ModalName.Company_Notice]: true,
          },
        },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should match snapshot', async () => {
    const { baseElement } = render(<InfoModalManager />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
  });

  test('should init modal status when the modal was first rendered', () => {
    expect(scopeDispatch).toBeCalledTimes(0);
    render(<InfoModalManager />);
    expect(scopeDispatch).toBeCalledTimes(1);
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        modalStatus: {
          [ModalName.SHOW_VERSION]: false,
          [ModalName.Company_Notice]: false,
        },
      },
      type: 'nav/initModalStatus',
    });
  });
});
