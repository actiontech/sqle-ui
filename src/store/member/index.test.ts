import reducers, { updateSelectMember, updateSelectMemberGroup } from '.';
import { IReduxState } from '..';
import { mockMemberGroupList } from '../../page/Member/MemberGroupList/__test__/utils';
import { mockMemberList } from '../../page/Member/MemberList/__test__/utils';

describe('test store/member', () => {
  const state: IReduxState['member'] = {
    selectMember: null,
    selectMemberGroup: null,
    modalStatus: {},
  };

  test('should create action', () => {
    expect(updateSelectMember({ member: mockMemberList[0] })).toEqual({
      type: 'member/updateSelectMember',
      payload: {
        member: mockMemberList[0],
      },
    });
    expect(
      updateSelectMemberGroup({ memberGroup: mockMemberGroupList[0] })
    ).toEqual({
      type: 'member/updateSelectMemberGroup',
      payload: {
        memberGroup: mockMemberGroupList[0],
      },
    });
  });

  test('should update selectMember when dispatch updateSelectMember action', () => {
    const newState = reducers(
      state,
      updateSelectMember({
        member: mockMemberList[0],
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectMember: mockMemberList[0],
      selectMemberGroup: null,
      modalStatus: {},
    });
  });

  test('should update selectMemberGroup when dispatch updateSelectMemberGroup action', () => {
    const newState = reducers(
      state,
      updateSelectMemberGroup({
        memberGroup: mockMemberGroupList[0],
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectMember: null,
      selectMemberGroup: mockMemberGroupList[0],
      modalStatus: {},
    });
  });
});
