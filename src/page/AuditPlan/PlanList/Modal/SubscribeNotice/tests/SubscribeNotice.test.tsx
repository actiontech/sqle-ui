import { fireEvent, screen, waitFor } from '@testing-library/react';
import SubscribeNotice from '..';
import audit_plan from '../../../../../../api/audit_plan';
import { ModalName } from '../../../../../../data/ModalName';
import { getBySelector } from '../../../../../../testUtils/customQuery';
import { renderWithTheme } from '../../../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../../../../testUtils/mockRequest';
import { mockUseStyle } from '../../../../../../testUtils/mockStyle';
import { AuditPlanList } from '../../../__testData__';
import { auditPlanSubscribeNoticeConfig } from './__testData__';

describe('SubscribeNotice', () => {
  let dispatchSpy!: jest.SpyInstance;

  let conoleError: any;
  beforeAll(() => {
    conoleError = console.error;
    console.error = (...args: any[]) => {
      if (
        args[0].includes(
          `\`children\` is array of render props cannot have \`name\``
        )
      ) {
        return;
      }
      conoleError(...args);
    };
  });

  beforeEach(() => {
    jest.useFakeTimers();
    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockGetAuditPlanNotifyConfigV1();
    mockUseStyle();
    mockUseSelector({
      auditPlan: {
        modalStatus: {
          [ModalName.Subscribe_Notice]: true,
        },
        selectAuditPlan: AuditPlanList[0],
      },
      user: {},
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.error = conoleError;
  });

  const mockUpdateAuditPlanNotifyConfigV1 = () => {
    const spy = jest.spyOn(audit_plan, 'updateAuditPlanNotifyConfigV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockGetAuditPlanNotifyConfigV1 = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanNotifyConfigV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(auditPlanSubscribeNoticeConfig)
    );
    return spy;
  };

  const mockTestAuditPlanNotifyConfigV1 = () => {
    const spy = jest.spyOn(audit_plan, 'testAuditPlanNotifyConfigV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        is_notify_send_normal: true,
      })
    );
    return spy;
  };

  it('should match snapshot', async () => {
    const getConfig = mockGetAuditPlanNotifyConfigV1();
    const { baseElement } = renderWithTheme(<SubscribeNotice />);

    expect(baseElement).toMatchSnapshot();
    expect(getConfig).toBeCalledTimes(1);
    expect(getConfig).toBeCalledWith({
      audit_plan_name: 'audit_for_java_app11',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(baseElement).toMatchSnapshot();
  });

  it('should clean form when user close modal', async () => {
    renderWithTheme(<SubscribeNotice />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByLabelText('auditPlan.subscribeNotice.form.interval')
    ).toHaveValue('6');
    fireEvent.click(screen.getByText('common.close'));
    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).nthCalledWith(1, {
      payload: {
        modalName: 'SUBSCRIBE_NOTICE',
        status: false,
      },
      type: 'auditPlan/updateModalStatus',
    });
    expect(dispatchSpy).nthCalledWith(2, {
      payload: null,
      type: 'auditPlan/updateSelectAuditPlan',
    });

    expect(
      screen.getByLabelText('auditPlan.subscribeNotice.form.interval')
    ).toHaveValue('10');

    // 条件编译在jest环境中并不可用
    // expect(
    //   screen.getByLabelText('auditPlan.subscribeNotice.form.webhooksEnable')
    // ).toBeChecked();

    expect(getBySelector('.ant-modal')).toHaveStyle({ width: '1000px' });
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    expect(getBySelector('.ant-modal')).toHaveStyle({ width: '520px' });
  });

  it('should update config when user input all field and click submit', async () => {
    renderWithTheme(<SubscribeNotice />);
    const submitSpy = mockUpdateAuditPlanNotifyConfigV1();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.input(
      screen.getByLabelText('auditPlan.subscribeNotice.form.interval'),
      {
        target: { value: '30' },
      }
    );
    fireEvent.click(
      screen.getByLabelText('auditPlan.subscribeNotice.form.emailEnable')
    );

    fireEvent.click(screen.getByText('common.submit'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toBeDisabled();

    expect(submitSpy).toBeCalledTimes(1);
    expect(submitSpy).toBeCalledWith({
      audit_plan_name: 'audit_for_java_app11',
      enable_email_notify: false,
      enable_web_hook_notify: true,
      notify_interval: 30,
      notify_level: 'error',
      web_hook_template: `{
            "msg_type": "text2",
            "bbb": {
               "aaa":"{{.subject}} \\n {{.body}}"
            }
          }`,
      web_hook_url: 'prospero://kdmgujzl.tw/kgkredqxr',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).not.toBeDisabled();

    expect(
      screen.queryByText(
        'auditPlan.subscribeNotice.form.subscribeNoticeSuccess'
      )
    ).toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText(
        'auditPlan.subscribeNotice.form.subscribeNoticeSuccess'
      )
    ).not.toBeInTheDocument();
  });

  it('should test config when user click test button', async () => {
    const testSpy = mockTestAuditPlanNotifyConfigV1();
    renderWithTheme(<SubscribeNotice />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseEnter(screen.getByTestId('testMessage'));

    await waitFor(() => {
      jest.runAllTimers();
    });
    expect(
      screen.queryByText('auditPlan.subscribeNotice.form.testTips')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('testMessage'));
    expect(
      screen.queryByText('auditPlan.subscribeNotice.form.testLoading')
    ).toBeInTheDocument();
    expect(testSpy).toBeCalledTimes(1);
    expect(testSpy).toBeCalledWith({
      audit_plan_name: 'audit_for_java_app11',
    });
    fireEvent.click(screen.getByTestId('testMessage'));
    expect(testSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('auditPlan.subscribeNotice.form.testLoading')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('auditPlan.subscribeNotice.form.testSuccess')
    ).toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('auditPlan.subscribeNotice.form.testSuccess')
    ).not.toBeInTheDocument();
  });

  test('should show error message when request is_smtp_send_normal is equal false', async () => {
    const testSpy = mockTestAuditPlanNotifyConfigV1();
    testSpy.mockImplementation(() =>
      resolveThreeSecond({
        is_notify_send_normal: false,
        send_error_message: 'error message',
      })
    );
    renderWithTheme(<SubscribeNotice />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseEnter(screen.getByTestId('testMessage'));

    await waitFor(() => {
      jest.runAllTimers();
    });
    expect(
      screen.queryByText('auditPlan.subscribeNotice.form.testTips')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('testMessage'));
    expect(
      screen.queryByText('auditPlan.subscribeNotice.form.testLoading')
    ).toBeInTheDocument();
    expect(testSpy).toBeCalledTimes(1);
    expect(testSpy).toBeCalledWith({
      audit_plan_name: 'audit_for_java_app11',
    });
    fireEvent.click(screen.getByTestId('testMessage'));
    expect(testSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('auditPlan.subscribeNotice.form.testLoading')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('auditPlan.subscribeNotice.form.testSuccess')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('error message')).toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryByText('error message')).not.toBeInTheDocument();
  });

  test('should set template to default when user click reset template button', async () => {
    renderWithTheme(<SubscribeNotice />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByLabelText('auditPlan.subscribeNotice.form.webhooksTemplate')
    ).toHaveValue(
      `{            "msg_type": "text2",            "bbb": {               "aaa":"{{.subject}} \\n {{.body}}"            }          }`
    );
    fireEvent.click(
      screen.getByText(
        'auditPlan.subscribeNotice.form.webhooksTemplateHelp.reset'
      )
    );
    expect(
      screen.getByLabelText('auditPlan.subscribeNotice.form.webhooksTemplate')
    ).toHaveValue(
      `{  "msg_type": "text",  "content": {     "text":"{{.subject}} \\n {{.body}}"  }}`
    );
  });
});
