import reducers, { updateSelectProject } from '.';
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
  });

  const state: IReduxState['projectManage'] = {
    selectProject: null,
    modalStatus: {},
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
    });
  });
});
