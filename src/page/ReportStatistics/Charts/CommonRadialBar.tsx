import { RadialBar } from '@ant-design/plots';
import { useTheme } from '@material-ui/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CommonChartsColors, CommonRadialBarProps } from '.';
import { IReduxState } from '../../../store';
import { Theme } from '../../../types/theme.type';
import reportStatisticsData from '../index.data';
import logo from '../../../assets/img/logo.png';

const { rowHeight } = reportStatisticsData;

const CommonRadialBar: React.FC<CommonRadialBarProps> = (props) => {
  const {
    h,
    maxAngle = 350,
    radius = 1,
    innerRadius = 0.2,
    color = CommonChartsColors,
    barBackground = {},
    annotations = [
      {
        type: 'html',
        position: ['50%', '50%'],
        html: (_, view) => {
          const coord = view.getCoordinate() as any;
          const w = coord.polarRadius * coord.innerRadius * 1.15 * 1.2;
          return `<div style="transform:translate(-50%,-46%)">
        <img width="${w}" height="${w}" alt="" src="${logo}">
      </div>`;
        },
      },
    ],
  } = props;
  const currentTheme = useSelector<IReduxState, string>(
    (state) => state.user.theme
  );
  const language = useSelector<IReduxState, string>(
    (state) => state.locale.language
  );
  const theme = useTheme<Theme>();
  const height = useMemo(() => {
    return rowHeight * h + theme.common.padding * (h - 1) - 80;
  }, [h, theme.common.padding]);
  return (
    <RadialBar
      {...props}
      maxAngle={maxAngle}
      radius={radius}
      innerRadius={innerRadius}
      annotations={annotations}
      barBackground={barBackground}
      theme={currentTheme}
      locale={language}
      height={height}
      color={color}
    />
  );
};

export default CommonRadialBar;
