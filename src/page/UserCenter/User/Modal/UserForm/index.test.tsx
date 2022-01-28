import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import UserForm from '.';

describe('User/Modal/UserForm', () => {
  test('should match snapshot when isUpdate is falsy', () => {
    const { result } = renderHook(() => useForm());
    const { container } = render(
      <UserForm form={result.current[0]} roleNameList={[]} userGroupList={[]} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when isUpdate is truthy', () => {
    const { result } = renderHook(() => useForm());
    const { container } = render(
      <UserForm
        isUpdate={true}
        form={result.current[0]}
        roleNameList={[]}
        userGroupList={[]}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
