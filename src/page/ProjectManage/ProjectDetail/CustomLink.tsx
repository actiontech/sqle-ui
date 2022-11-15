import { Link } from 'react-router-dom';
import { CustomLinkProps, ProjectDetailCustomLinkState } from '.';

/**
 *
 * @param param0
 * @returns
 */
const CustomLink: React.FC<CustomLinkProps> = ({
  to,
  projectName,
  search,
  children,
  ...props
}) => {
  return (
    <Link<ProjectDetailCustomLinkState>
      {...props}
      to={{ pathname: to, search, state: { projectName } }}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
