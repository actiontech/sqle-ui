// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Data Source',
  pageDesc: 'You can register the database that needs SQL audit here.',

  databaseListTitle: 'Database List',

  databaseList: {
    instanceName: 'Instance Name',
    address: 'Instance Address',
    describe: 'Describe',
    role: 'Role',
    ruleTemplate: 'Rule Template',
    workflow: 'Workflow',
  },

  addDatabase: 'Add Database',
  addDatabaseSuccess: 'Add Database successfully',
  addDatabaseSuccessGuide:
    'Go to the data source list to view the database just added',

  updateDatabase: {
    getDatabaseInfoError: 'Get database info failed',
    updateDatabaseTitle: 'Update Database',
    updateDatabaseSuccess: 'Update Database "{{name}}" successfully',
  },

  dataSourceForm: {
    name: 'Instance Name',
    describe: 'Describe',
    ip: 'Ip',
    port: 'Port',
    user: 'User',
    password: 'Password',
    role: 'Role',
    ruleTemplate: 'Rule Template',
    workflow: 'Workflow',

    testDatabaseConnection: 'Test database connectivity',
    testing: 'Trying to connect...',
    testSuccess: 'Database connectivity test succeeded',
    testFailed: 'Failed to link to the database',
  },

  deleteDatabase: {
    confirmMessage: 'Are you sure delete this instance "{{name}}"?',
    deletingDatabase: 'Deleting Database "{{name}}"...',
    deleteSuccessTips: 'Delete Database "{{name}}" successfully',
  },
};
