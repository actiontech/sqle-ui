export interface CopyIconProps {
  text?: string;
  onCopy?: (event?: React.MouseEvent<HTMLDivElement>) => void;
  tooltips?: boolean | React.ReactNode;
  format?: 'text/plain' | 'text/html';
  children?: React.ReactNode;
}

export { default } from './CopyIcon';
