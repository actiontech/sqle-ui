import React from 'react';
import useNavigate from '../useNavigate';

const useBack = () => {
  const navigate = useNavigate();

  const goBack = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return { goBack };
};

export default useBack;
