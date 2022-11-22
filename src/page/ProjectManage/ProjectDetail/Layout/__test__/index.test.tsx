import { SystemRole } from '../../../../../data/common';
import { projectDetailRouterConfig } from '../../../../../router/config';
import { generateNavigateMenu } from '../index';

describe('test ProjectManage/ProjectDetailLayout/index', () => {
  test('should match snapshot', () => {
    expect(
      generateNavigateMenu(projectDetailRouterConfig, SystemRole.admin, 'test')
    ).toMatchSnapshot();

    expect(
      generateNavigateMenu(projectDetailRouterConfig, '', 'test')
    ).toMatchSnapshot();
  });
});
