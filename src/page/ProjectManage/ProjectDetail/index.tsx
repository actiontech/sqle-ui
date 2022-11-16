import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import ProjectDetail from './ProjectDetail';

//todo 后续需要换个方式实现当前项目名称的保存与获取.
export const useCurrentProjectName = () => {
  const projectName = useSelector((state: IReduxState) => {
    return state.projectManage.selectProject?.name ?? '';
  });
  return { projectName };
};

export default ProjectDetail;
