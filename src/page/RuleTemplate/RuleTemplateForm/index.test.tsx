import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import RuleTemplateForm from '.';
import { IRuleResV1 } from '../../../api/common';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { allRules } from '../../Rule/__testData__';

describe('RuleTemplate/RuleTemplateForm', () => {
  test('should match snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { container } = renderWithThemeAndRouter(
      <RuleTemplateForm
        form={result.current[0]}
        activeRule={[]}
        allRules={allRules as IRuleResV1[]}
        ruleListLoading={false}
        submitLoading={false}
        step={0}
        updateActiveRule={jest.fn()}
        baseInfoSubmit={jest.fn()}
        prevStep={jest.fn()}
        submit={jest.fn()}
      >
        this is children
      </RuleTemplateForm>
    );
    expect(container).toMatchSnapshot();
  });
});
