import { makeStyles } from '@mui/styles';
import darkTheme from './dark';
import lightTheme from './light';
import { Theme } from '@mui/material/styles';

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
  projectLayoutSider: {
    borderRight: theme.projectLayoutSider.border,
  },
  optionsHover: {
    '&:hover': {
      background: theme.optionsHover.background,
    },
  },
  auditResultLevelNormalBox: {
    color: theme.auditResultLevelNormalBox.color,
    border: theme.auditResultLevelNormalBox.border,
  },
}));

export { SupportTheme, ThemeData };
export default useStyles;
