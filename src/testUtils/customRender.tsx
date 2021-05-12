import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  BrowserRouter,
  Router,
  RouterProps,
  MemoryRouter,
  MemoryRouterProps,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Dictionary } from '../types/common.type';
import { storeFactory } from './mockRedux';
import lightTheme from '../theme/light';
import { ThemeProvider } from '@material-ui/styles';
import { mount, shallow } from 'enzyme';

type RenderParams = Parameters<typeof render>;
type MountParams = Parameters<typeof mount>;
type ShallowParams = Parameters<typeof shallow>;

export const renderWithRouter = (...[ui, option]: [...RenderParams]) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>, option);
};

export const renderWithRedux = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(
    <Provider store={storeFactory(initStore)}>{ui}</Provider>,
    option
  );
};

export const renderHooksWithRedux = <TProps, TResult>(
  hooks: (props: TProps) => TResult,
  storeState: Dictionary = {}
) => {
  return renderHook(hooks, {
    wrapper: Provider,
    initialProps: {
      store: storeFactory(storeState),
    },
  } as any);
};

export const renderWithServerRouter = (
  ...[ui, option, props]: [...RenderParams, RouterProps]
) => {
  return render(<Router {...props}>{ui}</Router>, option);
};

export const renderWithMemoryRouter = (
  ...[ui, option, props]: [...RenderParams, MemoryRouterProps?]
) => {
  return render(<MemoryRouter {...props}>{ui}</MemoryRouter>, option);
};

export const renderWithTheme = (...[ui, option]: [...RenderParams]) => {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>, option);
};

export const renderWithThemeAndRouter = (
  ...[ui, option]: [...RenderParams]
) => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>
    </MemoryRouter>,
    option
  );
};

export const mountWithTheme = (...[ui, option]: [...MountParams]) => {
  return mount(ui, {
    ...option,
    wrappingComponent: ThemeProvider,
    wrappingComponentProps: {
      theme: lightTheme,
    },
  });
};

export const shallowWithTheme = (...[ui, option]: [...ShallowParams]) => {
  return shallow(ui, {
    ...option,
    wrappingComponent: ThemeProvider,
    wrappingComponentProps: {
      theme: lightTheme,
    },
  });
};
