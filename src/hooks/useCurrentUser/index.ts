import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import { SystemRole } from '../../data/common';
const useRole = () => {
  const role = useSelector<IReduxState, string>((state) => state.user.role);
  const isAdmin: boolean = role === SystemRole.admin;
  return { isAdmin };
};
export default useRole;
