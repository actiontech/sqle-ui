import { fireEvent, screen, waitFor } from '@testing-library/react';
import WorkflowTemplateList from '.';
import workflow from '../../../api/workflow';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { createMemoryHistory } from 'history';

describe('WorkflowTemplateList', () => {
  let getWorkflowTemplateListSpy: jest.SpyInstance;

  const mockGetWorkflowTemplate = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond([
        { workflow_template_name: 'default', desc: '默认模板' },
        { workflow_template_name: 'db1', desc: '123' },
      ])
    );
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    getWorkflowTemplateListSpy = mockGetWorkflowTemplate();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithRouter(<WorkflowTemplateList />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should delete template when user confirm delete', async () => {
    const deleteSpy = jest.spyOn(workflow, 'deleteWorkflowTemplateV1');
    deleteSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithRouter(<WorkflowTemplateList />);
    expect(getWorkflowTemplateListSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getAllByText('common.delete')[0]);
    expect(
      screen.queryByText('workflowTemplate.delete.confirm')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(
      screen.queryByText('workflowTemplate.delete.deleting')
    ).toBeInTheDocument();
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({
      workflow_template_name: 'default',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('workflowTemplate.delete.deleting')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('workflowTemplate.delete.successTips')
    ).toBeInTheDocument();
    expect(getWorkflowTemplateListSpy).toBeCalledTimes(2);
  });

  test('should stay in current page when user click cancel delete button', async () => {
    const history = createMemoryHistory();
    renderWithServerRouter(<WorkflowTemplateList />, undefined, { history });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(history.location.pathname).toBe('/');
    fireEvent.click(screen.getAllByText('common.delete')[0]);
    expect(
      screen.queryByText('workflowTemplate.delete.confirm')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(history.location.pathname).toBe('/');
  });
});
