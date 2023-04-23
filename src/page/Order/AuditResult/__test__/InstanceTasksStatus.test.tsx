import { render } from '@testing-library/react';
import { GetWorkflowTasksItemV2StatusEnum } from '../../../../api/common.enum';
import InstanceTasksStatus from '../InstanceTasksStatus';

describe('test Order/AuditResult/InstanceTasksStatus', () => {
  test('should match snapshot', () => {
    const { container, rerender } = render(<InstanceTasksStatus />);
    expect(container).toMatchSnapshot();

    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV2StatusEnum.wait_for_audit}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV2StatusEnum.wait_for_execution}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV2StatusEnum.exec_failed}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV2StatusEnum.exec_scheduled}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV2StatusEnum.exec_succeeded}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV2StatusEnum.executing}
      />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <InstanceTasksStatus
        status={GetWorkflowTasksItemV2StatusEnum.manually_executed}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
