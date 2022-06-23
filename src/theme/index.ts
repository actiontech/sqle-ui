import { makeStyles } from '@material-ui/styles';
import { Theme } from '../types/theme.type';
import darkTheme from './dark';
import lightTheme from './light';

enum SupportTheme {
  DARK = 'dark',
  LIGHT = 'light',
}

const ThemeData = {
  [SupportTheme.DARK]: darkTheme,
  [SupportTheme.LIGHT]: lightTheme,
};

const useStyles = makeStyles<Theme>((theme) => ({
  headerBg: {
    backgroundColor: theme.header.background,
    color: theme.header.color,
  },
  editor: {
    border: theme.editor.border,
    paddingRight: 1,
  },
}));

export { SupportTheme, ThemeData };
export default useStyles;
