import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProjectListItem } from '../../api/common';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';

type ProjectManageReduxState = {
  modalStatus: ModalStatus;
  selectProject: IProjectListItem | null;
  archived: boolean;
};

const initialState: ProjectManageReduxState = {
  selectProject: null,
  modalStatus: {},
  archived: false,
};

const projectManage = createSlice({
  name: 'projectManage',
  initialState,
  reducers: {
    updateSelectProject(
      state,
      {
        payload: { project },
      }: PayloadAction<{ project: IProjectListItem | null }>
    ) {
      state.selectProject = project;
    },
    updateProjectStatus(state, { payload: archived }: PayloadAction<boolean>) {
      state.archived = archived;
    },
    ...commonModalReducer(),
  },
});

export const {
  updateProjectStatus,
  updateSelectProject,
  initModalStatus: initProjectManageModalStatus,
  updateModalStatus: updateProjectManageModalStatus,
} = projectManage.actions;

export default projectManage.reducer;
