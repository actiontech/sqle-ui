import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import Wechat from './Wechat';
import user from '../../../api/user';
import { getBySelector } from '../../../testUtils/customQuery';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

describe('Wechat', () => {
  const mockRequest = () => {
    const spy = jest.spyOn(user, 'updateCurrentUserV1');
    return spy;
  };

  test('should render wechat by userInfo of props', () => {
    const { container, rerender } = render(
      <Wechat refreshUserInfo={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <Wechat
        refreshUserInfo={jest.fn()}
        userInfo={{ wechat_id: '123123123' }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should start edit wechat when click edit icon', () => {
    const wrapper = shallow(<Wechat refreshUserInfo={jest.fn()} />);
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

  test('should auto focus input when edit wechat', () => {
    render(
      <Wechat
        refreshUserInfo={jest.fn()}
        userInfo={{ wechat_id: '123123123' }}
      />
    );
    fireEvent.click(getBySelector('.anticon-edit'));
    expect(getBySelector('.ant-input')).toHaveFocus();
  });

  test('should exit edit mode when user press "esc" key', () => {
    render(
      <Wechat refreshUserInfo={jest.fn()} userInfo={{ wechat_id: '123123' }} />
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

  test('should update user wechat when press enter', async () => {
    jest.useFakeTimers();
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() => resolveThreeSecond({}));
    const refreshUserInfoMock = jest.fn();

    render(
      <Wechat
        refreshUserInfo={refreshUserInfoMock}
        userInfo={{ wechat_id: '123123' }}
      />
    );
    const input = getBySelector('.ant-input');
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    fireEvent.click(getBySelector('.anticon-edit'));
    fireEvent.input(input, { target: { value: 'aaabbb' } });
    fireEvent.keyDown(input, { key: 'enter' });
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).not.toHaveAttribute('hidden');

    expect(requestSpy).toBeCalledTimes(1);
    expect(requestSpy).toBeCalledWith({ wechat_id: 'aaabbb' });

    await waitFor(() => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('account.updateWechatSuccess')
    ).toBeInTheDocument();
    expect(refreshUserInfoMock).toBeCalledTimes(1);
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    jest.useRealTimers();
  });
});
