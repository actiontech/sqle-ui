import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  common: {
    padding: 24,
    color: {
      warning: '#faad14',
      disabledFont: 'rgba(0, 0, 0, .85)',
    },
  },

  header: {
    background: '#001529',
    color: '#fff',
  },
  editor: {
    border: '1px solid #d9d9d9',
  },
  projectLayoutSider: {
    border: '1px solid #d9d9d9',
  },
  optionsHover: {
    background: '#f5f5f5',
  },
});

export default lightTheme;
