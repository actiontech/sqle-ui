import reducers, {
  refreshProjectOverview,
  updateProjectStatus,
  updateSelectProject,
} from '.';
import { IReduxState } from '..';

describe('store/projectManage', () => {
  test('should create action', () => {
    expect(
      updateSelectProject({
        project: {
          name: 'name1',
          desc: 'desc',
          create_time: '2022-11-01',
          create_user_name: 'admin',
        },
      })
    ).toEqual({
      payload: {
        project: {
          name: 'name1',
          desc: 'desc',
          create_time: '2022-11-01',
          create_user_name: 'admin',
        },
      },
      type: 'projectManage/updateSelectProject',
    });

    expect(updateProjectStatus(true)).toEqual({
      payload: true,
      type: 'projectManage/updateProjectStatus',
    });

    expect(refreshProjectOverview()).toEqual({
      type: 'projectManage/refreshProjectOverview',
    });
  });

  const state: IReduxState['projectManage'] = {
    selectProject: null,
    modalStatus: {},
    archived: false,
    overviewRefreshFlag: false,
  };

  test('should update selectProject when dispatch updateSelectProject action', () => {
    const newState = reducers(
      state,
      updateSelectProject({
        project: {
          name: 'name1',
          desc: 'desc',
          create_time: '2022-11-01',
          create_user_name: 'admin',
        },
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectProject: {
        name: 'name1',
        desc: 'desc',
        create_time: '2022-11-01',
        create_user_name: 'admin',
      },
      modalStatus: {},
      archived: false,
      overviewRefreshFlag: false,
    });
  });

  test('should update archived when dispatch updateProjectStatus action', () => {
    const newState = reducers(state, updateProjectStatus(true));
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectProject: null,
      modalStatus: {},
      archived: true,
      overviewRefreshFlag: false,
    });
  });

  test('should update overviewRefreshFlag when dispatch refreshProjectOverview action', () => {
    const newState = reducers(state, refreshProjectOverview());
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectProject: null,
      modalStatus: {},
      archived: false,
      overviewRefreshFlag: true,
    });
  });
});
