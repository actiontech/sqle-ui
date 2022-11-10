import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks/dom';
import { Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import {
  mockUseInstance,
  mockUseRole,
} from '../../../../testUtils/mockRequest';
import RoleSelector from '../RoleSelector';

describe('test RoleSelector', () => {
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
        <RoleSelector />
      </Form>
    );
  };

  test('should match snapshot', async () => {
    const { container } = renderComponent();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
    expect(useRoleSpy).toBeCalledTimes(1);
    expect(useInstanceSpy).toBeCalledTimes(1);
  });

  test('should be able to add and remove items', () => {
    renderComponent();

    expect(screen.queryAllByLabelText('member.roleSelector.role').length).toBe(
      1
    );
    expect(
      screen.queryAllByLabelText('member.roleSelector.instance').length
    ).toBe(1);
    expect(screen.queryByTestId('remove-item')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('common.add'));

    expect(screen.queryAllByLabelText('member.roleSelector.role').length).toBe(
      2
    );
    expect(
      screen.queryAllByLabelText('member.roleSelector.instance').length
    ).toBe(2);
    expect(screen.queryByTestId('remove-item')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('remove-item'));
    expect(screen.queryAllByLabelText('member.roleSelector.role').length).toBe(
      1
    );
    expect(
      screen.queryAllByLabelText('member.roleSelector.instance').length
    ).toBe(1);
  });
});
