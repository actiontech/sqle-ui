import { fireEvent, render, screen, act } from '@testing-library/react';
import { message } from 'antd';
import { shallow } from 'enzyme';
import configuration from '../../../../api/configuration';
import { getBySelector } from '../../../../testUtils/customQuery';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import CustomTitle from '../CustomTitle';

describe('test CustomTitle', () => {
  const refresh = jest.fn();
  const title = 'title';

  const mockRequest = () => {
    const spy = jest.spyOn(configuration, 'personalise');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };
  const mockErrorMessage = () => {
    const spy = jest.spyOn(message, 'error');
    return spy;
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  test('should match snapshot', () => {
    const { container } = render(
      <CustomTitle refresh={refresh} title={title} />
    );

    expect(container).toMatchSnapshot();
  });

  test('should start edit emit when click edit icon', () => {
    const wrapper = shallow(<CustomTitle refresh={refresh} title={title} />);
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
    render(<CustomTitle refresh={refresh} title={title} />);
    fireEvent.click(getBySelector('.anticon-edit'));
    expect(getBySelector('.ant-input')).toHaveFocus();
  });

  test('should exit edit mode when user press "esc" key', () => {
    render(<CustomTitle refresh={refresh} title={title} />);
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
    const requestSpy = mockRequest();
    const errorMessageSpy = mockErrorMessage();
    jest.useFakeTimers();
    render(<CustomTitle refresh={refresh} title={title} />);
    const input = getBySelector('.ant-input');
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    fireEvent.click(getBySelector('.anticon-edit'));
    fireEvent.input(input, { target: { value: title } });
    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    });

    expect(errorMessageSpy).toBeCalledTimes(1);
    expect(errorMessageSpy).nthCalledWith(1, 'system.personalize.match');

    fireEvent.input(input, { target: { value: 'newTitle' } });
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
    expect(requestSpy).toBeCalledWith({ title: 'newTitle' });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('system.personalize.updateTitleSuccessTips')
    ).toBeInTheDocument();
    expect(refresh).toBeCalledTimes(1);
    expect(
      getBySelector('.ant-input-affix-wrapper').parentNode
    ).toHaveAttribute('hidden');

    jest.useRealTimers();
  });
});
