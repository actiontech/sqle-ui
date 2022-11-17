import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import { SystemRole } from '../../data/common';
import { useCallback } from 'react';
const useCurrentUser = () => {
  const { role, bindProjects } = useSelector((state: IReduxState) => {
    return {
      role: state.user.role,
      bindProjects: state.user.bindProjects,
    };
  });
  const isAdmin: boolean = role === SystemRole.admin;

  const isProjectManager = useCallback(
    (projectName: string) => {
      const project = bindProjects.find((v) => v.projectName === projectName);
      return !!project && !!project.isManager;
    },
    [bindProjects]
  );

  return { isAdmin, isProjectManager, bindProjects };
};
export default useCurrentUser;
