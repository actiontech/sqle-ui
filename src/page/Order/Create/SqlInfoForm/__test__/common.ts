import instance from '../../../../../api/instance';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';

export const mockGetInstance = () => {
  const spy = jest.spyOn(instance, 'getInstanceV2');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      instance_name: 'db1',
      db_host: '20.20.20.2',
      db_port: '3306',
      db_user: 'root',
      db_type: 'mysql',
      desc: '',
      workflow_template_name: 'workflow-template-name-1',
      rule_template: {
        name: 'not_submit_test_rule33',
        is_global_rule_template: true,
      },
    })
  );

  return spy;
};
