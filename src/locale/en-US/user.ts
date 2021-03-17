// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'User Manage',
  pageDesc:
    'You can manage the users of the platform here, and users can only see or operate the data sources contained in all the roles they have bound.',

  userListTitle: 'User List',

  createUser: {
    button: 'Create User',
    modalTitle: 'Create User',
    createSuccessTips: 'Create User "{{name}}" successfully',
  },

  updateUser: {
    modalTitle: 'Update User',
    updateSuccessTips: 'Update user "{{name}}" successfully',
  },

  userForm: {
    username: 'Username',
    password: 'Password',
    passwordConfirm: 'Confirm Password',
    email: 'Email',
    role: 'Role',

    passwordConfirmPlaceholder: 'Please keep the same password twice',
  },

  userListFilter: {
    usernamePlaceholder: 'Search username',
    rolePlaceholder: 'Search role',
  },

  deleteUser: {
    confirmTitle: 'Are you sure delete this user: "{{username}}"?',
    deleting: 'Deleting user: "{{username}}...',
    deleteSuccess: 'Delete user "{{username}}" successfully',
  },

  userList: {
    emailPlaceholder: 'Empty',
    rolePlaceHolder: 'Empty',
    role: 'Role',
  },

  roleListTitle: 'Role List',

  createRole: {
    button: 'Create Role',
    modalTitle: 'Create Role',
    createSuccessTips: 'Create role "{{name}}" successfully',
  },

  updateRole: {
    modalTitle: 'Update Role',
    updateSuccessTips: 'Update role "{{name}}" successfully',
  },

  deleteRole: {
    deleteTips: 'Are you sure delete this role: "{{name}}"?',
    deleting: 'Deleting role "{{name}}"...',
    deleteSuccessTips: 'Delete Role "{{name}}" successfully',
  },

  roleForm: {
    roleName: 'Role Name',
    roleDesc: 'Role Describe',
    databases: 'Bind Databases',
    usernames: 'Bind Usernames',
  },

  roleListFilter: {
    usernamePlaceholder: 'Search username',
    rolePlaceholder: 'Search role',
    databasePlaceholder: 'Search database',
  },

  roleList: {
    roleDescPlaceholder: 'Empty',
    usernamePlaceholder: 'Empty',
    databasePlaceholder: 'Empty',
    username: 'Usernames',
    database: 'Databases',
  },
};
