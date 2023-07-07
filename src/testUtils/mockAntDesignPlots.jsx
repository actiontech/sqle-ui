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
const Gauge = MockPlots;
const Column = MockPlots;
const mockRegisterShape = jest.fn();
const G2 = {
  registerShape: jest.fn(),
};

export { Line, Pie, RadialBar, Gauge, Column, G2, mockRegisterShape };

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Line,
  Pie,
  RadialBar,
  Gauge,
  Column,
  G2,
};
