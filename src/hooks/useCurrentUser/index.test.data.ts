import {
  IManagementPermissionResV1,
  IUserBindProjectResV1,
} from '../../api/common';

export const mockBindProjects: IUserBindProjectResV1[] = [
  {
    is_manager: true,
    project_name: 'default',
  },
  {
    is_manager: false,
    project_name: 'test',
  },
];

export const mockManagementPermissions: IManagementPermissionResV1[] = [
  {
    code: 1,
    desc: '创建项目',
  },
];
