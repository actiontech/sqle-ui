import { LinkProps, useParams } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';
import { Pathname, Search } from 'history';

export type CustomLinkProps = Omit<LinkProps, 'to'> & {
  to: Pathname;
  search?: Search;
} & ProjectDetailUrlParamType;

export type ProjectDetailUrlParamType = {
  projectName: string;
};

export const useCurrentProjectName = () => {
  const { projectName = '' } = useParams<ProjectDetailUrlParamType>();
  return { projectName };
};

export default ProjectDetail;
