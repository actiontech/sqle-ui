import { render } from '@testing-library/react';
import { IAuditTaskResV1 } from '../../../api/common';
import {
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum,
} from '../../../api/common.enum';
import task from '../../../api/task';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { taskSqls } from '../Detail/__testData__';
import AuditResultCollection from './AuditResultCollection';

const taskInfos: IAuditTaskResV1[] = [
  {
    task_id: 27,
    instance_name: 'mysql-1',
    instance_schema: 'db1',
    pass_rate: 0,
    status: AuditTaskResV1StatusEnum.audited,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    audit_level: AuditTaskResV1AuditLevelEnum.normal,
    score: 30,
  },
  {
    task_id: 28,
    instance_name: 'mysql-2',
    instance_schema: '',
    pass_rate: 0,
    status: AuditTaskResV1StatusEnum.audited,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    audit_level: AuditTaskResV1AuditLevelEnum.normal,
    score: 30,
  },
];

describe('test AuditResultCollection', () => {
  const mockSetAuditResultActiveKey = jest.fn();
  beforeEach(() => {
    mockGetTaskSqls();
    mockUpdateTaskSqlDesc();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  const mockGetTaskSqls = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(taskSqls, { otherData: { total_nums: 20 } })
    );
    return spy;
  };
  const mockUpdateTaskSqlDesc = () => {
    const spy = jest.spyOn(task, 'updateAuditTaskSQLsV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };
  test('should match snapshot when showOverview is equal false', () => {
    const { container } = render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={taskInfos[0].task_id?.toString() ?? ''}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
