import { render } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import MemberModal from '..';
import { ModalName } from '../../../../data/ModalName';

import {
  mockUseInstance,
  mockUseRole,
} from '../../../../testUtils/mockRequest';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});
const projectName = 'default';

describe('test', () => {
  const dispatchSpy = jest.fn();

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    mockUseRole();
    mockUseInstance();
    useParamsMock.mockReturnValue({ projectName });
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: {
            [ModalName.Add_Member]: false,
            [ModalName.Update_Member]: false,
            [ModalName.Add_Member_Group]: false,
            [ModalName.Update_Member_Group]: false,
          },
        },
      })
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should dispatch "initMemberModalStatus" when MemberModal is first render', () => {
    expect(dispatchSpy).toBeCalledTimes(0);
    render(<MemberModal />);
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Add_Member]: false,
          [ModalName.Update_Member]: false,
          [ModalName.Add_Member_Group]: false,
          [ModalName.Update_Member_Group]: false,
        },
      },
    });
  });
});
