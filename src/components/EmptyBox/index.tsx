import React from 'react';

const EmptyBox: React.FC<{
  if: boolean;
  defaultNode?: React.ReactElement | JSX.Element | string;
}> = (props) => {
  if (!props.if) {
    return <>{props.defaultNode ?? null}</>;
  }
  return <>{props.children}</>;
};

export default EmptyBox;
