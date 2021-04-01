import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import { updateTheme } from '../../store/user';
import { SupportTheme, ThemeData } from '../../theme';

const useChangeTheme = () => {
  const theme = useSelector<IReduxState, string>((state) => state.user.theme);
  const [changeLoading, setChangeLoading] = React.useState(false);
  const dispatch = useDispatch();

  const currentThemeData = React.useMemo(() => {
    switch (theme) {
      case SupportTheme.DARK:
        return ThemeData[SupportTheme.DARK];
      case SupportTheme.LIGHT:
      default:
        return ThemeData[SupportTheme.LIGHT];
    }
  }, [theme]);

  const currentEditorTheme = React.useMemo(() => {
    switch (theme) {
      case SupportTheme.DARK:
        return 'vs-dark';
      case SupportTheme.LIGHT:
      default:
        return 'vs';
    }
  }, [theme]);

  const changeThemeStyle = React.useCallback((theme: SupportTheme) => {
    let newId = 'light-theme';
    let styleTagId = '#dark-theme';
    let href = '/antd.min.css';
    if (theme === SupportTheme.DARK) {
      newId = 'dark-theme';
      styleTagId = '#light-theme';
      href = '/antd.dark.min.css';
      if (!!document.querySelector(`#${newId}`)) {
        return;
      }
    } else if (!!document.querySelector(`#${newId}`)) {
      return;
    }

    const styleElement = document.querySelector(styleTagId);
    const newStyleElement = document.createElement('link');
    newStyleElement.id = newId;
    newStyleElement.type = 'text/css';
    newStyleElement.rel = 'stylesheet';
    newStyleElement.href = href;
    setChangeLoading(true);
    if (styleElement) {
      newStyleElement.onload = () => {
        setChangeLoading(false);
        styleElement.remove();
      };
      styleElement.after(newStyleElement);
    } else {
      const title = document.querySelector('head title');
      title?.after(newStyleElement);
    }
  }, []);

  const changeTheme = React.useCallback(
    (theme: SupportTheme) => {
      changeThemeStyle(theme);
      dispatch(updateTheme({ theme: theme }));
    },
    [changeThemeStyle, dispatch]
  );

  //TODO: implements in backend
  React.useEffect(() => {
    if (theme === SupportTheme.DARK) {
      changeTheme(SupportTheme.DARK);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    changeLoading,
    currentTheme: theme,
    currentEditorTheme,
    currentThemeData,
    changeTheme,
  };
};

export default useChangeTheme;
