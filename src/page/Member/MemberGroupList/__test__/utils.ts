import { IGetMemberGroupRespDataV1 } from '../../../../api/common';
import user_group from '../../../../api/user_group';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';

export const mockMemberGroupList: IGetMemberGroupRespDataV1[] = [
  {
    user_group_name: 'test',
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

export const mockGetMemberGroups = () => {
  const spy = jest.spyOn(user_group, 'getMemberGroupsV1');
  spy.mockImplementation(() => resolveThreeSecond(mockMemberGroupList));
  return spy;
};

export const mockDeleteMemberGroup = () => {
  const spy = jest.spyOn(user_group, 'deleteMemberGroupV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};
