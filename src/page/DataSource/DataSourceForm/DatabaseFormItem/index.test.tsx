import { Form } from 'antd';
import { act } from 'react-dom/test-utils';
import DatabaseFormItem from '.';
import instance from '../../../../api/instance';
import EmitterKey from '../../../../data/EmitterKey';
import { mountWithTheme } from '../../../../testUtils/customRender';
import {
  resolveThreeSecond,
  mockDriver,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';

describe('DatabaseFormItem', () => {
  const mockRequest = () => {
    const spy = jest.spyOn(instance, 'checkInstanceIsConnectableV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        is_instance_connectable: false,
        connect_error_message: 'error message',
      })
    );
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockDriver();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should input all required filed when test instance connectable', async () => {
    const request = mockRequest();
    const validateFields = jest.fn();
    validateFields.mockReturnValue(
      Promise.resolve({
        ip: '1.1.1.1',
        password: '123456',
        user: 'root',
        port: '4444',
        type: 'mysql',
        params: {
          a: 'b',
          b: 'c',
          c: true,
        },
      })
    );

    const wrapper = mountWithTheme(
      <Form>
        <DatabaseFormItem
          form={{ validateFields: validateFields } as any}
          currentAsyncParams={[
            { desc: '字段a', key: 'a', type: 'string', value: '123' },
            { desc: '字段b', key: 'b', type: 'int', value: '123' },
            { desc: '字段c', key: 'c', type: 'bool', value: 'true' },
          ]}
        />
      </Form>
    );
    act(() => {
      wrapper.find('Button').simulate('click');
    });
    await act(async () => jest.advanceTimersByTime(0));

    wrapper.update();
    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith({
      host: '1.1.1.1',
      port: '4444',
      user: 'root',
      password: '123456',
      db_type: 'mysql',
      additional_params: [
        {
          name: 'a',
          value: 'b',
        },
        {
          name: 'b',
          value: 'c',
        },
        {
          name: 'c',
          value: 'true',
        },
      ],
    });
    let connectButton = wrapper.find('TestDatabaseConnectButton');
    expect(connectButton.prop('loading')).toBe(true);

    await act(async () => jest.advanceTimersByTime(3000));

    wrapper.update();

    connectButton = wrapper.find('TestDatabaseConnectButton');
    expect(connectButton.prop('initHide')).toBe(false);
    expect(connectButton.prop('loading')).toBe(false);
    expect(connectButton.prop('connectAble')).toBe(false);
    expect(connectButton.prop('connectDisableReason')).toBe('error message');
  });

  test('should set initHide to false when event emit dispatch reset action', async () => {
    mockRequest();
    const validateFields = jest.fn();
    validateFields.mockReturnValue(
      Promise.resolve({
        ip: '1.1.1.1',
        password: '123456',
        user: 'root',
        port: '4444',
        type: 'mysql',
        params: {
          a: 'a',
          b: 'b',
        },
      })
    );
    const wrapper = mountWithTheme(
      <Form>
        <DatabaseFormItem form={{ validateFields: validateFields } as any} />
      </Form>
    );
    act(() => {
      wrapper.find('Button').simulate('click');
    });

    await act(async () => jest.runOnlyPendingTimers());

    await act(async () => jest.advanceTimersByTime(3000));

    wrapper.update();
    let connectButton = wrapper.find('TestDatabaseConnectButton');
    expect(connectButton.prop('initHide')).toBe(false);

    act(() => {
      EventEmitter.emit(EmitterKey.Reset_Test_Data_Source_Connect);
    });
    wrapper.update();
    connectButton = wrapper.find('TestDatabaseConnectButton');
    expect(connectButton.prop('initHide')).toBe(true);
  });

  test('should unsubscribe action when umount component', () => {
    mockRequest();

    const validateFields = jest.fn();
    validateFields.mockReturnValue(
      Promise.resolve({
        ip: '1.1.1.1',
        password: '123456',
        user: 'root',
        port: '4444',
        type: 'mysql',
        params: {
          a: 'a',
          b: 'b',
        },
      })
    );

    let subTemp;
    const subscribe = jest.spyOn(EventEmitter, 'subscribe');
    subscribe.mockImplementation((key, fn) => {
      subTemp = fn;
    });
    const unsubscribe = jest.spyOn(EventEmitter, 'unsubscribe');

    const wrapper = mountWithTheme(
      <Form>
        <DatabaseFormItem form={{ validateFields: validateFields } as any} />
      </Form>
    );

    expect(subscribe).toBeCalledTimes(1);
    expect(subscribe).toBeCalledWith(
      EmitterKey.Reset_Test_Data_Source_Connect,
      subTemp
    );
    act(() => {
      wrapper.unmount();
    });
    expect(unsubscribe).toBeCalledTimes(1);
    expect(unsubscribe).toBeCalledWith(
      EmitterKey.Reset_Test_Data_Source_Connect,
      subTemp
    );
  });
});
