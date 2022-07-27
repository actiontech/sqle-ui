import React from 'react';

export interface IQuickLinkProps {
  handleClick?: () => void;
  text: string;
  icon: React.ReactNode;
}
