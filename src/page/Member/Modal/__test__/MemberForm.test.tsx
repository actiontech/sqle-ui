import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import {
  mockUseInstance,
  mockUseRole,
} from '../../../../testUtils/mockRequest';
import MemberForm from '../MemberForm';

describe('test MemberForm', () => {
  beforeEach(() => {
    mockUseRole();
    mockUseInstance();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { container, rerender } = render(
      <MemberForm form={result.current[0]} />
    );

    expect(container).toMatchSnapshot();

    rerender(<MemberForm form={result.current[0]} isUpdate={true} />);
    expect(container).toMatchSnapshot();
  });
});
