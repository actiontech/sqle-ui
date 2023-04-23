import { useCallback } from 'react';
import {
  NavigateFunction,
  NavigateOptions,
  To,
  useNavigate as useOriginNavigate,
} from 'react-router-dom';
import { SQLE_BASE_URL } from '../../data/common';

function navigateFunction(innerNavigate: NavigateFunction, delta: number): void;
function navigateFunction(
  innerNavigate: NavigateFunction,
  to: To,
  options?: NavigateOptions
): void;
function navigateFunction(
  innerNavigate: NavigateFunction,
  to: number | To,
  options?: NavigateOptions
) {
  if (typeof to === 'number') {
    return innerNavigate(to);
  }

  if (typeof to === 'string') {
    if (to.startsWith(SQLE_BASE_URL)) {
      return innerNavigate(to, options);
    }
    return innerNavigate(`${SQLE_BASE_URL}${to}`, options);
  }

  if (to.pathname?.startsWith(SQLE_BASE_URL)) {
    return innerNavigate(to, options);
  }

  return innerNavigate(
    {
      ...to,
      pathname: to.pathname ? `${SQLE_BASE_URL}${to.pathname}` : undefined,
    },
    options
  );
}

const useNavigate = (): NavigateFunction => {
  const innerNavigate = useOriginNavigate();

  const navigate = useCallback(
    (to: number | To, options?: NavigateOptions) => {
      if (typeof to === 'number') {
        navigateFunction(innerNavigate, to);
      } else {
        navigateFunction(innerNavigate, to, options);
      }
    },
    [innerNavigate]
  );

  return navigate;
};

export default useNavigate;
