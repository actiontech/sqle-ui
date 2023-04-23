import { Line } from '@ant-design/plots';
import { useTheme } from '@mui/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CommonChartsColors, CommonLineProps } from '.';
import { IReduxState } from '../../../store';
import reportStatisticsData from '../index.data';
import { Theme } from '@mui/material/styles';
const { rowHeight } = reportStatisticsData;

const CommonLine: React.FC<CommonLineProps> = (props) => {
  const { h, color = CommonChartsColors, padding = 'auto' } = props;
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
    <Line
      {...props}
      padding={padding}
      theme={currentTheme}
      locale={language}
      height={height}
      color={color}
    />
  );
};

export default CommonLine;
