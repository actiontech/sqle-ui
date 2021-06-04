import AddWhitelist from '.';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import { SupportTheme } from '../../../../../theme';
import { ModalName } from '../../../../../data/ModalName';
import { renderWithTheme } from '../../../../../testUtils/customRender';
import audit_whitelist from '../../../../../api/audit_whitelist';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '../../../../../api/common.enum';

// https://github.com/react-monaco-editor/react-monaco-editor/issues/176
jest.mock('react-monaco-editor', () => {
  return (props: any) => <input {...props} />;
});

describe('Whitelist/WhitelistList/Modal/AddWhitelist', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      whitelist: { modalStatus: { [ModalName.Add_Whitelist]: true } },
    });
    const { scopeDispatch } = mockUseDispatch();
    dispatchMock = scopeDispatch;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should match snapshot', async () => {
    const { baseElement } = renderWithTheme(<AddWhitelist />);
    expect(baseElement).toMatchSnapshot();
    cleanup();
    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
    });
    const { baseElement: closedContainer } = renderWithTheme(<AddWhitelist />);
    expect(closedContainer).toMatchSnapshot();
  });

  test('should set visible to false when user click closeModal', async () => {
    renderWithTheme(<AddWhitelist />);
    fireEvent.input(screen.getByLabelText('whitelist.table.desc'), {
      target: { value: 'whitelist desc' },
    });
    fireEvent.click(screen.getByText('common.close'));

    expect(screen.getByLabelText('whitelist.table.desc')).toHaveValue('');
    expect(dispatchMock).toBeCalledTimes(1);
    expect(dispatchMock).toBeCalledWith({
      payload: {
        modalName: 'ADD_WHITELIST',
        status: false,
      },
      type: 'whitelist/updateModalStatus',
    });
  });

  test('should send create whitelist request when user click submit button', async () => {
    const createAuditWhitelistSpy = jest.spyOn(
      audit_whitelist,
      'createAuditWhitelistV1'
    );
    createAuditWhitelistSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');

    renderWithTheme(<AddWhitelist />);
    fireEvent.input(screen.getByLabelText('whitelist.table.desc'), {
      target: { value: 'whitelist desc' },
    });
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table1;' },
    });

    fireEvent.click(screen.getByText('common.submit'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(createAuditWhitelistSpy).toBeCalledTimes(1);
    expect(createAuditWhitelistSpy).toBeCalledWith({
      desc: 'whitelist desc',
      match_type: CreateAuditWhitelistReqV1MatchTypeEnum.exact_match,
      value: 'select * from table1;',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Whitelist_List);
    expect(screen.getByLabelText('whitelist.table.desc')).toHaveValue('');
    emitSpy.mockRestore();
  });
});
