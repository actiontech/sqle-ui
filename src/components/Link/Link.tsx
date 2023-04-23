import { Link } from 'react-router-dom';
import { CustomLinkProps } from '.';
import { SQLE_BASE_URL } from '../../data/common';

const CustomLink: React.FC<CustomLinkProps> = ({ to, ...props }) => {
  let path = to;

  if (typeof to === 'string') {
    path = to.startsWith(SQLE_BASE_URL) ? to : `${SQLE_BASE_URL}${to}`;
  } else {
    path = {
      ...to,
      pathname: to.pathname
        ? to.pathname.startsWith(SQLE_BASE_URL)
          ? to.pathname
          : `${SQLE_BASE_URL}${to.pathname}`
        : undefined,
    };
  }
  return <Link {...props} to={path} />;
};

export default CustomLink;
