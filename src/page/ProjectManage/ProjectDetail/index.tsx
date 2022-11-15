import { LinkProps, useLocation } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';
import CustomLink from './CustomLink';
import useCustomHistory from './useCustomHistory';
import { Pathname, Search } from 'history';

export type CustomLinkProps = Omit<LinkProps, 'to'> & {
  to: Pathname;
  search?: Search;
} & ProjectDetailCustomLinkState;

export type ProjectDetailCustomLinkState = {
  projectName: string;
};

//todo 后续需要换个方式实现当前项目名称的保存与获取.
export const useCurrentProjectName = () => {
  const location = useLocation<ProjectDetailCustomLinkState>();
  return { projectName: location.state?.projectName ?? '' };
};

export { CustomLink, useCustomHistory };

export default ProjectDetail;
