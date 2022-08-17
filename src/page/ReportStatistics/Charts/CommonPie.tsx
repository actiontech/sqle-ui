import { Pie } from '@ant-design/plots';
import { useTheme } from '@material-ui/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CommonChartsColors, CommonPieProps } from '.';
import { IReduxState } from '../../../store';
import { Theme } from '../../../types/theme.type';
import { floatToPercent } from '../../../utils/Math';
import reportStatisticsData from '../index.data';

const { rowHeight } = reportStatisticsData;
const CommonLine: React.FC<CommonPieProps> = (props) => {
  const {
    h,
    padding = 'auto',
    color = CommonChartsColors,
    radius = 1,
    label = {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${floatToPercent(percent)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions = [
      {
        type: 'element-active',
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
    <Pie
      {...props}
      padding={padding}
      radius={radius}
      label={label}
      interactions={interactions}
      theme={currentTheme}
      locale={language}
      height={height}
      color={color}
    />
  );
};

export default CommonLine;
