import React from 'react';
import { useHistory } from 'react-router';

const useBack = () => {
  const history = useHistory();

  const goBack = React.useCallback(() => {
    history.goBack();
  }, [history]);

  return { goBack };
};

export default useBack;
