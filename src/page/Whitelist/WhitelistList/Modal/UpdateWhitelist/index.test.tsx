import UpdateWhitelist from '.';
import { cleanup, fireEvent, screen, act } from '@testing-library/react';

import { SupportTheme } from '../../../../../theme';
import { ModalName } from '../../../../../data/ModalName';
import { renderWithTheme } from '../../../../../testUtils/customRender';
import audit_whitelist from '../../../../../api/audit_whitelist';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { WhitelistData } from '../../../__testData__';
import { UpdateAuditWhitelistReqV1MatchTypeEnum } from '../../../../../api/common.enum';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

// https://github.com/react-monaco-editor/react-monaco-editor/issues/176
jest.mock('react-monaco-editor', () => {
  return (props: any) => {
    const { editorDidMount, ...otherProps } = props;
    return <textarea {...otherProps} />;
  };
});

describe('Whitelist/WhitelistList/Modal/UpdateWhitelist', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();

    useParamsMock.mockReturnValue({ projectName });

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
        whitelist: {
          modalStatus: { [ModalName.Update_Whitelist]: true },
          selectWhitelist: WhitelistData[0],
        },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should match snapshot', async () => {
    const { baseElement } = renderWithTheme(<UpdateWhitelist />);
    expect(screen.getByLabelText('whitelist.table.desc')).toHaveValue(
      WhitelistData[0].desc
    );
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue(
      WhitelistData[0].value
    );
    expect(baseElement).toMatchSnapshot();
    cleanup();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
        whitelist: { modalStatus: { [ModalName.Update_Whitelist]: false } },
      })
    );
    const { baseElement: closedContainer } = renderWithTheme(
      <UpdateWhitelist />
    );
    expect(closedContainer).toMatchSnapshot();
  });

  test('should set visible to false when user click closeModal', async () => {
    renderWithTheme(<UpdateWhitelist />);

    fireEvent.click(screen.getByText('common.close'));

    expect(screen.getByLabelText('whitelist.table.desc')).toHaveValue('');
    expect(dispatchMock).toBeCalledTimes(1);
    expect(dispatchMock).toBeCalledWith({
      payload: {
        modalName: 'UPDATE_WHITELIST',
        status: false,
      },
      type: 'whitelist/updateModalStatus',
    });
  });

  test('should send create whitelist request when user click submit button', async () => {
    const createAuditWhitelistSpy = jest.spyOn(
      audit_whitelist,
      'UpdateAuditWhitelistByIdV1'
    );
    createAuditWhitelistSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');

    renderWithTheme(<UpdateWhitelist />);
    fireEvent.input(screen.getByLabelText('whitelist.table.desc'), {
      target: { value: 'whitelist desc' },
    });
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table1;' },
    });

    fireEvent.click(screen.getByText('common.submit'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(createAuditWhitelistSpy).toBeCalledTimes(1);
    expect(createAuditWhitelistSpy).toBeCalledWith({
      audit_whitelist_id: `${WhitelistData[0].audit_whitelist_id}`,
      desc: 'whitelist desc',
      match_type: UpdateAuditWhitelistReqV1MatchTypeEnum.fp_match,
      value: 'select * from table1;',
      project_name: projectName,
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Whitelist_List);
    expect(screen.getByLabelText('whitelist.table.desc')).toHaveValue('');
    emitSpy.mockRestore();
  });
});
