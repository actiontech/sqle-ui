import user from '../../../../api/user';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';

export const mockMemberList = [
  {
    is_owner: false,
    user_name: 'test',
    roles: [
      {
        instance_name: 'db1',
        role_names: ['test1', 'test2', 'test3'],
      },
      {
        instance_name: 'db2',
        role_names: ['test1', 'test2', 'test3'],
      },
      {
        instance_name: 'db3',
        role_names: ['test1', 'test2', 'test3'],
      },
      {
        instance_name: 'db4',
        role_names: ['test1', 'test2', 'test3'],
      },
    ],
  },
];

export const mockGetMembers = () => {
  const spy = jest.spyOn(user, 'getMembersV1');
  spy.mockImplementation(() => resolveThreeSecond(mockMemberList));
  return spy;
};

export const mockDeleteMember = () => {
  const spy = jest.spyOn(user, 'deleteMemberV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};
