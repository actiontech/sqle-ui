import { waitFor } from '@testing-library/react';
import WorkflowTemplateDetail from '.';
import workflow from '../../../api/workflow';
import {
  renderWithThemeAndRouter,
  renderWithThemeAndServerRouter,
} from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { workflowData } from '../__testData__';
import { createMemoryHistory } from 'history';
import { useParams } from 'react-router-dom';
jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});
describe('WorkflowTemplate/WorkflowTemplateDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const mockGetWorkflowTemplateDetail = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(workflowData));
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ workflowName: 'default' });
    mockGetWorkflowTemplateDetail();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should jump to progress when url params is not have workflowName', async () => {
    const history = createMemoryHistory();
    useParamsMock.mockReturnValue({});
    history.push('/progress/detail/default');
    renderWithThemeAndServerRouter(<WorkflowTemplateDetail />, undefined, {
      history,
    });
    expect(history.location.pathname).toBe('/progress');
  });

  test('should match snapshot', async () => {
    const { container } = renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
