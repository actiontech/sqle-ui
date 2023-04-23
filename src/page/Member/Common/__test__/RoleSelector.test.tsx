import { act, fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import {
  mockUseInstance,
  mockUseRole,
} from '../../../../testUtils/mockRequest';
import RoleSelector from '../RoleSelector';
import { renderHook } from '@testing-library/react-hooks';

describe('test RoleSelector', () => {
  const projectName = 'default';
  let useRoleSpy: jest.SpyInstance;
  let useInstanceSpy: jest.SpyInstance;
  beforeEach(() => {
    useRoleSpy = mockUseRole();
    useInstanceSpy = mockUseInstance();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const renderComponent = () => {
    const { result } = renderHook(() => useForm());
    return render(
      <Form form={result.current[0]}>
        <RoleSelector projectName={projectName} />
      </Form>
    );
  };

  test('should match snapshot', async () => {
    const { container } = renderComponent();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(useRoleSpy).toBeCalledTimes(1);
    expect(useInstanceSpy).toBeCalledTimes(1);
  });

  test('should be able to add and remove items', () => {
    renderComponent();

    expect(screen.queryAllByLabelText('member.roleSelector.role').length).toBe(
      0
    );
    expect(
      screen.queryAllByLabelText('member.roleSelector.instance').length
    ).toBe(0);
    expect(screen.queryByTestId('remove-item')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('member.roleSelector.addRole'));

    expect(screen.queryAllByLabelText('member.roleSelector.role').length).toBe(
      1
    );
    expect(
      screen.queryAllByLabelText('member.roleSelector.instance').length
    ).toBe(1);

    fireEvent.click(screen.getByText('member.roleSelector.addRole'));

    expect(screen.queryAllByLabelText('member.roleSelector.role').length).toBe(
      2
    );
    expect(
      screen.queryAllByLabelText('member.roleSelector.instance').length
    ).toBe(2);

    expect(screen.getAllByTestId('remove-item')[0]).toBeInTheDocument();

    fireEvent.click(screen.getAllByTestId('remove-item')[0]);
    expect(screen.queryAllByLabelText('member.roleSelector.role').length).toBe(
      1
    );
    expect(
      screen.queryAllByLabelText('member.roleSelector.instance').length
    ).toBe(1);
  });
});
