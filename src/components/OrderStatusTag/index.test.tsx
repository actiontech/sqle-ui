import OrderStatusTag from '.';
import { render } from '@testing-library/react';
import { WorkflowRecordResV1StatusEnum } from '../../api/common.enum';

describe('OrderStatusTag', () => {
  test('should render username by redux state', () => {
    const { container, rerender } = render(<OrderStatusTag />);
    expect(container).toMatchSnapshot();
    rerender(
      <OrderStatusTag status={WorkflowRecordResV1StatusEnum.canceled} />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV1StatusEnum.finished} />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV1StatusEnum.wait_for_audit} />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <OrderStatusTag
        status={WorkflowRecordResV1StatusEnum.wait_for_execution}
      />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV1StatusEnum.rejected} />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV1StatusEnum.exec_failed} />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV1StatusEnum.executing} />
    );
    expect(container).toMatchSnapshot();
  });
});
