import { fireEvent, screen, cleanup, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import CloneRuleTemplateModal from '.';
import rule_template from '../../../../../api/rule_template';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { renderWithRouter } from '../../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  resolveThreeSecond,
} from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';
import { ruleTemplateListData } from '../../../__testData__';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

describe('RuleTemplate/RuleTemplateList/Modal/CloneRuleTemplateModal', () => {
  let mockDispatch: jest.Mock;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

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
    useParamsMock.mockReturnValue({ projectName });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockCloneRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'cloneProjectRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

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

  test('should send clone template request when user click submit button', async () => {
    const cloneRequestSpy = mockCloneRuleTemplate();
    renderWithRouter(<CloneRuleTemplateModal />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName'),
      { target: { value: 'name1' } }
    );
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      { target: { value: 'desc1' } }
    );

    fireEvent.mouseDown(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.instances')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const option = screen.getAllByText('instance1')[1];
    fireEvent.click(option);

    fireEvent.click(screen.getByText('OK'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(cloneRequestSpy).toBeCalledTimes(1);
    expect(cloneRequestSpy).toBeCalledWith({
      desc: 'desc1',
      rule_template_name: ruleTemplateListData[0].rule_template_name,
      new_rule_template_name: 'name1',
      instance_name_list: ['instance1'],
      project_name: projectName,
    });
    expect(screen.getByText('OK').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('Cancel').parentNode).toHaveAttribute('disabled');

    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Rule_Template_List);
    expect(
      screen.queryByText('ruleTemplate.cloneRuleTemplate.successTips')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
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
});
