import { fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import useChangeTheme from '.';
import { renderHooksWithRedux } from '../../testUtils/customRender';
import { SupportTheme, ThemeData } from '../../theme';

describe('useChangeTheme', () => {
  afterEach(() => {
    document.querySelector('#light-theme')?.remove();
    document.querySelector('#dark-theme')?.remove();
  });

  test('should return default theme when redux in empty', () => {
    const { result } = renderHooksWithRedux(() => useChangeTheme(), {
      user: { theme: SupportTheme.LIGHT },
    });
    expect(result.current.changeLoading).toBe(false);
    expect(result.current.currentTheme).toBe(SupportTheme.LIGHT);
    expect(result.current.currentEditorTheme).toBe('vs');
    expect(result.current.currentThemeData).toEqual(
      ThemeData[SupportTheme.LIGHT]
    );
  });

  test('should render dark theme when theme in redux is dark', () => {
    const lightLink = document.createElement('link');
    lightLink.id = 'light-theme';
    document.querySelector('head')?.appendChild(lightLink);
    expect(document.querySelector('#light-theme')).not.toBeNull();
    expect(document.querySelector('#dark-theme')).toBeNull();
    const { result } = renderHooksWithRedux(() => useChangeTheme(), {
      user: { theme: SupportTheme.DARK },
    });
    expect(result.current.changeLoading).toBe(true);
    expect(result.current.currentTheme).toBe(SupportTheme.DARK);
    expect(result.current.currentEditorTheme).toBe('vs-dark');
    expect(result.current.currentThemeData).toEqual(
      ThemeData[SupportTheme.DARK]
    );
    act(() => {
      fireEvent.load(document.querySelector('#dark-theme') as HTMLLinkElement);
    });
    expect(document.querySelector('#light-theme')).toBeNull();
    expect(document.querySelector('#dark-theme')).not.toBeNull();
  });

  test('should dispatch updateTheme action and change link element when call changeTheme', () => {
    const lightLink = document.createElement('link');
    lightLink.id = 'light-theme';
    document.querySelector('head')?.appendChild(lightLink);
    expect(document.querySelector('#light-theme')).not.toBeNull();
    expect(document.querySelector('#dark-theme')).toBeNull();
    const { result } = renderHooksWithRedux(() => useChangeTheme(), {
      user: { theme: SupportTheme.LIGHT },
    });
    expect(result.current.changeLoading).toBe(false);
    expect(result.current.currentTheme).toBe(SupportTheme.LIGHT);
    expect(result.current.currentEditorTheme).toBe('vs');
    expect(result.current.currentThemeData).toEqual(
      ThemeData[SupportTheme.LIGHT]
    );

    act(() => {
      result.current.changeTheme(SupportTheme.DARK);
    });

    expect(result.current.changeLoading).toBe(true);
    expect(result.current.currentTheme).toBe(SupportTheme.DARK);
    expect(result.current.currentEditorTheme).toBe('vs-dark');
    expect(result.current.currentThemeData).toEqual(
      ThemeData[SupportTheme.DARK]
    );

    expect(document.querySelector('#light-theme')).not.toBeNull();
    expect(document.querySelector('#dark-theme')).not.toBeNull();

    act(() => {
      fireEvent.load(document.querySelector('#dark-theme') as HTMLLinkElement);
    });

    expect(result.current.changeLoading).toBe(false);
    expect(document.querySelector('#light-theme')).toBeNull();
    expect(document.querySelector('#dark-theme')).not.toBeNull();

    act(() => {
      result.current.changeTheme(SupportTheme.LIGHT);
    });

    expect(result.current.changeLoading).toBe(true);
    expect(result.current.currentTheme).toBe(SupportTheme.LIGHT);
    expect(result.current.currentEditorTheme).toBe('vs');
    expect(result.current.currentThemeData).toEqual(
      ThemeData[SupportTheme.LIGHT]
    );

    expect(document.querySelector('#light-theme')).not.toBeNull();
    expect(document.querySelector('#dark-theme')).not.toBeNull();

    act(() => {
      fireEvent.load(document.querySelector('#light-theme') as HTMLLinkElement);
    });

    expect(result.current.changeLoading).toBe(false);
    expect(document.querySelector('#light-theme')).not.toBeNull();
    expect(document.querySelector('#dark-theme')).toBeNull();
  });
});
