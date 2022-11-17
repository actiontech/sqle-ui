import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import {
  mockUseInstance,
  mockUseRole,
  mockUseUserGroup,
} from '../../../../testUtils/mockRequest';
import MemberGroupForm from '../MemberGroupForm';

describe('test MemberGroupForm', () => {
  const projectName = 'default';
  let useUserGroupSpy: jest.SpyInstance;

  beforeEach(() => {
    useUserGroupSpy = mockUseUserGroup();
    mockUseRole();
    mockUseInstance();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    expect(useUserGroupSpy).toBeCalledTimes(0);

    const { result } = renderHook(() => useForm());
    const { container, rerender } = render(
      <MemberGroupForm form={result.current[0]} projectName={projectName} />
    );
    expect(useUserGroupSpy).toBeCalledTimes(1);
    expect(useUserGroupSpy).toBeCalledWith({});

    expect(container).toMatchSnapshot();

    rerender(
      <MemberGroupForm
        form={result.current[0]}
        isUpdate={true}
        projectName={projectName}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
