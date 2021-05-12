import { fireEvent, render, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { shallow } from 'enzyme';
import UserEmail from '.';
import user from '../../../api/user';
import { getBySelector } from '../../../testUtils/customQuery';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

describe('UserEmail', () => {
  const mockErrorMessage = () => {
    const spy = jest.spyOn(message, 'error');
    return spy;
  };

  const mockSuccessMessage = () => {
    const spy = jest.spyOn(message, 'success');
    return spy;
  };

  const mockRequest = () => {
    const spy = jest.spyOn(user, 'updateCurrentUserV1');
    return spy;
  };

  test('should render email by userInfo of props', () => {
    const { container, rerender } = render(
      <UserEmail refreshUserInfo={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <UserEmail
        refreshUserInfo={jest.fn()}
        userInfo={{ email: 'aaaa@bbb.com' }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should start edit emit when click edit icon', () => {
    const wrapper = shallow(<UserEmail refreshUserInfo={jest.fn()} />);
    let emailWrapper = wrapper.find('Col').at(1);
    let textWrapper = emailWrapper.childAt(0);
    let editWrapper = emailWrapper.childAt(1);
    expect(textWrapper.prop('hidden')).toBe(false);
    expect(editWrapper.prop('hidden')).toBe(true);

    const editIcon = wrapper.find('ForwardRef(Link)');
    editIcon.simulate('click');
    wrapper.update();

    emailWrapper = wrapper.find('Col').at(1);
    textWrapper = emailWrapper.childAt(0);
    editWrapper = emailWrapper.childAt(1);
    expect(textWrapper.prop('hidden')).toBe(true);
    expect(editWrapper.prop('hidden')).toBe(false);
  });

  test('should auto focus input when edit email', () => {
    render(
      <UserEmail
        refreshUserInfo={jest.fn()}
        userInfo={{ email: 'aaaa@bbb.cc' }}
      />
    );
    fireEvent.click(getBySelector('.anticon-edit'));
    expect(getBySelector('.ant-input')).toHaveFocus();
  });

  test('should exit edit mode when user press "esc" key', () => {
    render(
      <UserEmail
        refreshUserInfo={jest.fn()}
        userInfo={{ email: 'aaaa@bbb.cc' }}
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

    fireEvent.keyDown(input, { key: 'esc' });

    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');
    // expect(input).not.toHaveFocus();
  });

  test('should validate email is valid email address', () => {
    const errorMessageSpy = mockErrorMessage();

    render(
      <UserEmail
        refreshUserInfo={jest.fn()}
        userInfo={{ email: 'aaaa@bbb.cc' }}
      />
    );
    const input = getBySelector('.ant-input');
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    fireEvent.click(getBySelector('.anticon-edit'));
    fireEvent.input(input, { target: { value: 'aaa@@@@@mmmm.' } });
    fireEvent.keyDown(input, { key: 'enter' });

    expect(errorMessageSpy).toBeCalledTimes(1);
    expect(errorMessageSpy).toBeCalledWith('account.emailErrorMessage.type');
  });

  test('should check new email is same to old email address', () => {
    const errorMessageSpy = mockErrorMessage();

    render(
      <UserEmail
        refreshUserInfo={jest.fn()}
        userInfo={{ email: 'aaaa@bbb.cc' }}
      />
    );
    const input = getBySelector('.ant-input');
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    fireEvent.click(getBySelector('.anticon-edit'));
    fireEvent.input(input, { target: { value: 'aaaa@bbb.cc' } });
    fireEvent.keyDown(input, { key: 'enter' });

    expect(errorMessageSpy).toBeCalledTimes(1);
    expect(errorMessageSpy).toBeCalledWith('account.emailErrorMessage.match');
  });

  test('should update user email when new email is valid pass', async () => {
    jest.useFakeTimers();
    const successMessageSyp = mockSuccessMessage();
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() => resolveThreeSecond({}));
    const refreshUserInfoMock = jest.fn();

    render(
      <UserEmail
        refreshUserInfo={refreshUserInfoMock}
        userInfo={{ email: 'aaaa@bbb.cc' }}
      />
    );
    const input = getBySelector('.ant-input');
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    fireEvent.click(getBySelector('.anticon-edit'));
    fireEvent.input(input, { target: { value: 'test@gmail.com' } });
    fireEvent.keyDown(input, { key: 'enter' });
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).not.toHaveAttribute('hidden');

    expect(requestSpy).toBeCalledTimes(1);

    await waitFor(() => jest.advanceTimersByTime(3000));

    expect(successMessageSyp).toBeCalledTimes(1);
    expect(successMessageSyp).toBeCalledWith('account.updateEmailSuccess');
    expect(refreshUserInfoMock).toBeCalledTimes(1);
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    jest.useRealTimers();
  });
});
