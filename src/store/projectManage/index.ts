import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProjectListItem } from '../../api/common';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';

type ProjectManageReduxState = {
  modalStatus: ModalStatus;
  selectProject: IProjectListItem | null;
};

const initialState: ProjectManageReduxState = {
  selectProject: null,
  modalStatus: {},
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
    ...commonModalReducer(),
  },
});

export const {
  updateSelectProject,
  initModalStatus: initProjectManageModalStatus,
  updateModalStatus: updateProjectManageModalStatus,
} = projectManage.actions;

export default projectManage.reducer;
