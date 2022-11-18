import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import RoleForm from '.';

describe('User/Modal/RoleForm', () => {
  test('should match snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { container } = render(
      <RoleForm form={result.current[0]} operationList={[]} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when isUpdate is truthy', () => {
    const { result } = renderHook(() => useForm());
    const { container } = render(
      <RoleForm isUpdate={true} form={result.current[0]} operationList={[]} />
    );
    expect(container).toMatchSnapshot();
  });
});
