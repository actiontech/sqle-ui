import { cloneDeep, isObject } from 'lodash';
const MockPlots = (props) => {
  const cloneProps = cloneDeep(props);

  Object.keys(cloneProps).forEach((key) => {
    if (isObject(cloneProps[key])) {
      cloneProps[key] = JSON.stringify(cloneProps[key]);
    }
  });
  return <div {...cloneProps} />;
};

const Line = MockPlots;
const Pie = MockPlots;
const RadialBar = MockPlots;

export { Line, Pie, RadialBar };

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Line,
  Pie,
  RadialBar,
};
