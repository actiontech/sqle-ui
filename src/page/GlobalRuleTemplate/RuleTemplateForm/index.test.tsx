import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import RuleTemplateForm from '.';
import { IRuleResV1 } from '../../../api/common';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { allRulesWithType } from '../../Rule/__testData__';
import { mockDriver } from '../../../testUtils/mockRequest';

describe('RuleTemplate/RuleTemplateForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockDriver();
  });
  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  test('should match snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { container } = renderWithThemeAndRouter(
      <RuleTemplateForm
        form={result.current[0]}
        activeRule={[]}
        allRules={allRulesWithType as IRuleResV1[]}
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
