import { fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import {
  mockUseInstance,
  mockUseRole,
  mockUseUsername,
} from '../../../../testUtils/mockRequest';
import MemberForm from '../MemberForm';
import { screen } from '@testing-library/react';

describe('test MemberForm', () => {
  const projectName = 'default';
  let useUsernameSpy: jest.SpyInstance;
  beforeEach(() => {
    useUsernameSpy = mockUseUsername();
    mockUseRole();
    mockUseInstance();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    expect(useUsernameSpy).toBeCalledTimes(0);
    const { result } = renderHook(() => useForm());
    const { container, rerender } = render(
      <MemberForm form={result.current[0]} projectName={projectName} />
    );
    expect(useUsernameSpy).toBeCalledTimes(1);
    expect(useUsernameSpy).toBeCalledWith({});

    expect(container).toMatchSnapshot();

    rerender(
      <MemberForm
        form={result.current[0]}
        isUpdate={true}
        projectName={projectName}
      />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <MemberForm
        form={result.current[0]}
        isUpdate={true}
        projectName={projectName}
        isManager={true}
      />
    );
    expect(
      screen.queryByText('member.roleSelector.addRole')
    ).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('should be call changeIsManager when clicked "projectAdmin"', () => {
    const { result } = renderHook(() => useForm());
    const mockChangeIsManager = jest.fn();
    render(
      <MemberForm
        form={result.current[0]}
        projectName={projectName}
        changeIsManager={mockChangeIsManager}
      />
    );
    expect(mockChangeIsManager).not.toBeCalled();
    fireEvent.click(screen.getByLabelText('member.memberForm.projectAdmin'));
    expect(mockChangeIsManager).toBeCalled();
    expect(mockChangeIsManager).toBeCalledWith(true);
  });
});
