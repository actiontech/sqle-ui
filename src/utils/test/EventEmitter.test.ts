import EmitterKey from '../../data/EmitterKey';
import EventEmitter from '../EventEmitter';

describe('utils/EventEmitter', () => {
  const TEST_KEY = 'TEST_KEY' as EmitterKey;

  test('should call subscribe function when emit event', () => {
    const willCall = jest.fn();
    EventEmitter.subscribe(TEST_KEY, willCall);
    EventEmitter.emit(TEST_KEY, 'test');
    expect(willCall).toBeCalledTimes(1);
    expect(willCall).toBeCalledWith('test');
    EventEmitter.unsubscribe(TEST_KEY, willCall);
  });

  test('should not call function which already unsubscribe', () => {
    const willCall = jest.fn();
    EventEmitter.subscribe(TEST_KEY, willCall);
    EventEmitter.unsubscribe(TEST_KEY, willCall);
    EventEmitter.emit(TEST_KEY, 'test');
    expect(willCall).not.toBeCalled();
  });

  test('should only toggle once when user subscribe event by once method', () => {
    const willCall = jest.fn();
    EventEmitter.once(TEST_KEY, willCall);
    EventEmitter.emit(TEST_KEY, 'test');
    expect(willCall).toBeCalledTimes(1);
    expect(willCall).toBeCalledWith('test');
    EventEmitter.emit(TEST_KEY, 'test2');
    expect(willCall).toBeCalledTimes(1);
  });
});
