import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { message } from 'antd';
import { shallow } from 'enzyme';
import user from '../../../api/user';
import { getBySelector } from '../../../testUtils/customQuery';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import UserPhone from './Phone';

describe('test Account/UserPhone', () => {
  const mockErrorMessage = () => {
    const spy = jest.spyOn(message, 'error');
    return spy;
  };

  const mockRequest = () => {
    const spy = jest.spyOn(user, 'updateCurrentUserV1');
    return spy;
  };

  test('should render phone by userInfo of props', () => {
    const { container, rerender } = render(
      <UserPhone refreshUserInfo={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <UserPhone
        refreshUserInfo={jest.fn()}
        userInfo={{ phone: '12312341234' }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should start edit emit when click edit icon', () => {
    const wrapper = shallow(<UserPhone refreshUserInfo={jest.fn()} />);
    let phoneWrapper = wrapper.find('Col').at(1);
    let textWrapper = phoneWrapper.childAt(0);
    let editWrapper = phoneWrapper.childAt(1);
    expect(textWrapper.prop('hidden')).toBe(false);
    expect(editWrapper.prop('hidden')).toBe(true);

    const editIcon = wrapper.find('ForwardRef(EditOutlined)');
    editIcon.simulate('click');
    wrapper.update();

    phoneWrapper = wrapper.find('Col').at(1);
    textWrapper = phoneWrapper.childAt(0);
    editWrapper = phoneWrapper.childAt(1);
    expect(textWrapper.prop('hidden')).toBe(true);
    expect(editWrapper.prop('hidden')).toBe(false);
  });

  test('should auto focus input when edit phone', () => {
    render(
      <UserPhone
        refreshUserInfo={jest.fn()}
        userInfo={{ phone: '12312341234' }}
      />
    );
    fireEvent.click(getBySelector('.anticon-edit'));
    expect(getBySelector('.ant-input')).toHaveFocus();
  });

  test('should exit edit mode when user press "esc" key', () => {
    render(
      <UserPhone
        refreshUserInfo={jest.fn()}
        userInfo={{ phone: '12312341234' }}
      />
    );
    const input = getBySelector('.ant-input');
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    fireEvent.click(getBySelector('.anticon-edit'));

    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).not.toHaveAttribute('hidden');
    expect(input).toHaveFocus();

    fireEvent.keyDown(input, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });

    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');
  });

  test('should update user phone when press enter', async () => {
    const errorMessageSpy = mockErrorMessage();

    jest.useFakeTimers();
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() => resolveThreeSecond({}));
    const refreshUserInfoMock = jest.fn();

    render(
      <UserPhone
        refreshUserInfo={refreshUserInfoMock}
        userInfo={{ phone: '12312341234' }}
      />
    );
    const input = getBySelector('.ant-input');
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    fireEvent.click(getBySelector('.anticon-edit'));
    fireEvent.input(input, { target: { value: '1234' } });
    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    });

    expect(errorMessageSpy).toBeCalledTimes(1);
    expect(errorMessageSpy).nthCalledWith(1, 'account.phoneErrorMessage.type');

    fireEvent.input(input, { target: { value: '12312341234' } });
    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    });

    expect(errorMessageSpy).toBeCalledTimes(2);
    expect(errorMessageSpy).nthCalledWith(2, 'account.phoneErrorMessage.match');

    fireEvent.input(input, { target: { value: '12312341235' } });
    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    });

    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).not.toHaveAttribute('hidden');

    expect(requestSpy).toBeCalledTimes(1);
    expect(requestSpy).toBeCalledWith({ phone: '12312341235' });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('account.updatePhoneSuccess')).toBeInTheDocument();
    expect(refreshUserInfoMock).toBeCalledTimes(1);
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    jest.useRealTimers();
  });
});
