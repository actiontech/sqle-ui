import { render } from '@testing-library/react';
import { GetWorkflowTasksItemV1StatusEnum } from '../../../../api/common.enum';
import InstanceTasksStatus from '../InstanceTasksStatus';

describe('test Order/AuditResult/InstanceTasksStatus', () => {
  test('should match snapshot', () => {
    const { container, rerender } = render(<InstanceTasksStatus />);
    expect(container).toMatchSnapshot();

    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV1StatusEnum.wait_for_audit}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV1StatusEnum.wait_for_execution}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV1StatusEnum.exec_failed}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV1StatusEnum.exec_scheduled}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV1StatusEnum.exec_succeeded}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV1StatusEnum.executing}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
