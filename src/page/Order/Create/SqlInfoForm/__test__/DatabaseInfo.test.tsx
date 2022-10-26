import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks/dom';
import Form, { useForm } from 'antd/lib/form/Form';
import { WorkflowResV2ModeEnum } from '../../../../../api/common.enum';
import DatabaseInfo from '../DatabaseInfo';

describe('test Order/Create/SqlInfoForm/DatabaseInfo', () => {
  const instanceNameChange = jest.fn();
  const setInstanceNames = jest.fn();
  const setChangeSqlModeDisabled = jest.fn();
  const clearTaskInfoWithKey = jest.fn();

  test('should match snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { container } = render(
      <Form form={result.current[0]}>
        <DatabaseInfo
          form={result.current[0]}
          instanceNameChange={instanceNameChange}
          setChangeSqlModeDisabled={setChangeSqlModeDisabled}
          setInstanceNames={setInstanceNames}
          clearTaskInfoWithKey={clearTaskInfoWithKey}
          currentSqlMode={WorkflowResV2ModeEnum.same_sqls}
        />
      </Form>
    );
    expect(container).toMatchSnapshot();
  });
});
