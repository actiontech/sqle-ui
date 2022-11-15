import { useHistory } from 'react-router-dom';
import { ProjectDetailCustomLinkState } from '.';

const useCustomHistory = () => {
  const history = useHistory<ProjectDetailCustomLinkState>();
  const push = (path: string, projectName: string) => {
    history.push(path, { projectName });
  };

  const replace = (path: string, projectName: string) => {
    history.replace(path, { projectName });
  };

  return {
    ...history,
    push,
    replace,
  };
};

export default useCustomHistory;
