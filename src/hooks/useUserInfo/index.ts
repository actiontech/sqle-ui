import user from '../../api/user';
import { useRequest } from 'ahooks';
import {
  updateBindProjects,
  updateManagementPermissions,
  updateToken,
  updateUser,
} from '../../store/user';
import {
  ResponseCode,
  SQLE_REDIRECT_KEY_PARAMS_NAME,
  SystemRole,
} from '../../data/common';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useNavigate from '../useNavigate';

const useUserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const clearUserInfo = useCallback(() => {
    dispatch(updateBindProjects({ bindProjects: [] }));
    dispatch(
      updateUser({
        username: '',
        role: '',
      })
    );
    dispatch(
      updateToken({
        token: '',
      })
    );
    dispatch(updateManagementPermissions({ managementPermissions: [] }));
  }, [dispatch]);

  const {
    loading: getUserInfoLoading,
    run: getUserInfo,
    data: userInfo,
  } = useRequest(user.getCurrentUserV1.bind(user), {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        const data = res.data.data;

        dispatch(
          updateBindProjects({ bindProjects: data?.bind_projects ?? [] })
        );
        dispatch(
          updateUser({
            username: data?.user_name ?? '',
            role: data?.is_admin ? SystemRole.admin : '',
          })
        );
        dispatch(
          updateManagementPermissions({
            managementPermissions: data?.management_permission_list ?? [],
          })
        );
      } else {
        clearUserInfo();
        navigate(
          `/login?${SQLE_REDIRECT_KEY_PARAMS_NAME}=${location.pathname}`,
          { replace: true }
        );
      }
    },
    onError: () => {
      clearUserInfo();
      navigate(`/login?${SQLE_REDIRECT_KEY_PARAMS_NAME}=${location.pathname}`, {
        replace: true,
      });
    },
  });

  return {
    getUserInfoLoading,
    getUserInfo,
    clearUserInfo,
    userInfo,
  };
};

export default useUserInfo;
