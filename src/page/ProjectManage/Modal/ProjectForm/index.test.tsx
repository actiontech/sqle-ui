import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks/dom';
import { useForm } from 'antd/lib/form/Form';
import ProjectForm from '.';

describe('test ProjectManage/Modal/ProjectForm', () => {
  test('should match snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { container, rerender } = render(
      <ProjectForm form={result.current[0]} />
    );

    expect(container).toMatchSnapshot();

    rerender(<ProjectForm form={result.current[0]} isUpdate={true} />);

    expect(container).toMatchSnapshot();
  });
});
