import { IBindRoleReqV1 } from '../../../../api/common';
import renderRolesInfo from '../renderRolesInfo';

describe('test renderRolesInfo', () => {
  const roles: IBindRoleReqV1[] = [
    {
      instance_name: 'db1',
      role_names: ['test1', 'test2', 'test3'],
    },
    {
      instance_name: 'db2',
      role_names: ['test3'],
    },
    {
      instance_name: 'db3',
      role_names: ['test3', 'test4', 'test5', 'test6', 'test7'],
    },
  ];
  test('should match snapshot', () => {
    expect(renderRolesInfo(roles, false)).toMatchSnapshot();
    expect(renderRolesInfo(roles, true)).toMatchSnapshot();
  });
});
