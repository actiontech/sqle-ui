import { LinkProps } from 'react-router-dom';
export { default as Link } from './Link';

export type CustomLinkProps = LinkProps &
  React.RefAttributes<HTMLAnchorElement>;
