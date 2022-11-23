import * as useStyles from '../theme';

export const mockUseStyle = () => {
  const useStylesSpy = jest.spyOn(useStyles, 'default');
  useStylesSpy.mockImplementation(() => ({
    loginBg: 'loginBg-test',
    headerBg: 'headerBg-test',
    editor: 'editor-test',
    projectLayoutSider: 'projectLayoutSider-test',
  }));
  return useStylesSpy;
};
