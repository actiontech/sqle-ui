import { Theme } from '../types/theme.type';

const darkTheme: Theme = {
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
};

export default darkTheme;
