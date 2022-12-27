import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import { SystemRole } from '../../data/common';
import { useCallback } from 'react';
const useCurrentUser = () => {
  const { role, bindProjects, managementPermissions, username } = useSelector(
    (state: IReduxState) => {
      return {
        username: state.user.username,
        role: state.user.role,
        bindProjects: state.user.bindProjects,
        managementPermissions: state.user.managementPermissions,
      };
    }
  );
  const isAdmin: boolean = role === SystemRole.admin;

  const isProjectManager = useCallback(
    (projectName: string) => {
      const project = bindProjects.find((v) => v.project_name === projectName);
      return !!project && !!project.is_manager;
    },
    [bindProjects]
  );

  return {
    isAdmin,
    isProjectManager,
    bindProjects,
    managementPermissions,
    username,
  };
};
export default useCurrentUser;
