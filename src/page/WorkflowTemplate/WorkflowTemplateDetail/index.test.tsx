import { waitFor } from '@testing-library/react';
import WorkflowTemplateDetail from '.';
import workflow from '../../../api/workflow';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { workflowData } from '../__testData__';
import { useParams } from 'react-router-dom';
jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});
describe.skip('WorkflowTemplate/WorkflowTemplateDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getWorkflowTemplateDetail!: jest.SpyInstance;

  const mockGetWorkflowTemplateDetail = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(workflowData));
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ workflowName: 'default' });
    getWorkflowTemplateDetail = mockGetWorkflowTemplateDetail();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    expect(container).toMatchSnapshot();
    expect(getWorkflowTemplateDetail).toBeCalledWith({
      workflow_template_name: 'default',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
