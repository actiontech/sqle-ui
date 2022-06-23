import { Theme } from '../types/theme.type';

const lightTheme: Theme = {
  common: {
    padding: 24,
    color: {
      warning: '#faad14',
      disabledFont: 'rgba(0, 0, 0, .85)',
    },
  },

  header: {
    background: '#ffffff',
    color: 'rgba(0, 0, 0, .85)',
  },
  editor: {
    border: '1px solid #d9d9d9',
  },
};

export default lightTheme;
