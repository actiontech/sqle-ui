import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  common: {
    padding: 24,
    color: {
      warning: '#faad14',
      disabledFont: 'rgba(255, 255, 255, .85)',
    },
  },
  header: {
    background: '#001529',
    color: '#fff',
  },
  editor: {
    border: '1px solid #434343',
  },
  projectLayoutSider: {
    border: '1px solid #303030',
  },
  optionsHover: {
    background: 'hsla(0, 0%, 100%, 0.08)',
  },
  auditResultLevelNormalBox: {
    color: 'rgba(255, 255, 255, .85)',
    border: '1px solid rgba(255, 255, 255, .85)',
  },
});

export default darkTheme;
