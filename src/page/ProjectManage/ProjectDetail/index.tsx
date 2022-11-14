import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import ProjectDetail from './ProjectDetail';

export const useCurrentProjectName = () => {
  const projectName = useSelector((state: IReduxState) => {
    return state.projectManage.selectProject?.name ?? '';
  });
  return { projectName };
};

export default ProjectDetail;
