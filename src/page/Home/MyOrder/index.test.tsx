import { render, waitFor } from '@testing-library/react';
import MyOrder from '.';
import dashboard from '../../../api/dashboard';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

describe('Home/MyOrder', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(dashboard, 'getDashboardV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        workflow_statistics: {
          my_on_process_workflow_number: 200,
          my_rejected_workflow_number: 300,
          need_me_to_execute_workflow_number: 900,
          need_me_to_review_workflow_number: 2300,
        },
      })
    );
    return spy;
  };

  test('should show order num about me by request response', async () => {
    mockRequest();
    const { container } = render(<MyOrder />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
