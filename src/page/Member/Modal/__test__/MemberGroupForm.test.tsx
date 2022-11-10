import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import {
  mockUseInstance,
  mockUseRole,
} from '../../../../testUtils/mockRequest';
import MemberGroupForm from '../MemberGroupForm';

describe('test MemberGroupForm', () => {
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
      <MemberGroupForm form={result.current[0]} />
    );

    expect(container).toMatchSnapshot();

    rerender(<MemberGroupForm form={result.current[0]} isUpdate={true} />);
    expect(container).toMatchSnapshot();
  });
});
