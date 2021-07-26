import { fireEvent, screen, cleanup } from '@testing-library/react';
import CloneRuleTemplateModal from '.';
import { ModalName } from '../../../../../data/ModalName';
import { renderWithRouter } from '../../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import { mockUseInstance } from '../../../../../testUtils/mockRequest';
import { ruleTemplateListData } from '../../../__testData__';

describe('RuleTemplate/RuleTemplateList/Modal/CloneRuleTemplateModal', () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    const { scopeDispatch } = mockUseDispatch();
    mockUseInstance();
    mockUseSelector({
      ruleTemplate: {
        modalStatus: { [ModalName.Clone_Rule_Template]: true },
        selectRuleTemplate: ruleTemplateListData[0],
      },
    });
    mockDispatch = scopeDispatch;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { baseElement: nullElement } = renderWithRouter(
      <CloneRuleTemplateModal />
    );
    expect(nullElement).toMatchSnapshot();
    cleanup();
    mockUseSelector({
      ruleTemplate: {
        modalStatus: { [ModalName.Clone_Rule_Template]: false },
        selectRuleTemplate: ruleTemplateListData[0],
      },
    });
    const { baseElement } = renderWithRouter(<CloneRuleTemplateModal />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should close modal when use click cancel button', async () => {
    renderWithRouter(<CloneRuleTemplateModal />);
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      { target: { value: 'desc1' } }
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc')
    ).toHaveValue('');
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: 'CLONE_RULE_TEMPLATE',
        status: false,
      },
      type: 'ruleTemplate/updateModalStatus',
    });
  });

  test.skip('should send clone template request when user click submit button', async () => {});
});
