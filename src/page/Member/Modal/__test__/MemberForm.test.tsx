import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import {
  mockUseInstance,
  mockUseRole,
  mockUseUsername,
} from '../../../../testUtils/mockRequest';
import MemberForm from '../MemberForm';

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
  });
});
