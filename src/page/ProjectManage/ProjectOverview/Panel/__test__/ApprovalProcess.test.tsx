/* eslint-disable no-console */
import { act } from '@testing-library/react';
import { mockGetWorkflowTemplateV1 } from './mockApi';
import ApprovalProcess from '../ApprovalProcess';
import { panelCommonProps } from './index.data';
import { renderWithRouterAndRedux } from '../../../../../testUtils/customRender';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';
import { getHrefByText } from '../../../../../testUtils/customQuery';

describe('test ApprovalProcess', () => {
  let getWorkflowTemplateSpy: jest.SpyInstance;
  beforeEach(() => {
    getWorkflowTemplateSpy = mockGetWorkflowTemplateV1();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithRouterAndRedux(
      <ApprovalProcess {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    expect(getWorkflowTemplateSpy).toBeCalledTimes(1);
    expect(getWorkflowTemplateSpy).toBeCalledWith({
      project_name: panelCommonProps.projectName,
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      getHrefByText('projectManage.projectOverview.approvalProcess.action')
    ).toBe(`/project/${panelCommonProps.projectName}/progress/update/test`);
    expect(container).toMatchSnapshot();
  });

  test('should render error message', async () => {
    getWorkflowTemplateSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ message: 'error message' })
    );

    const { container } = renderWithRouterAndRedux(
      <ApprovalProcess {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
