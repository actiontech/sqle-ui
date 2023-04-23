import { RenderResult, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  BrowserRouter,
  Router,
  RouterProps,
  MemoryRouter,
  MemoryRouterProps,
  useLocation,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Dictionary } from '../types/common.type';
import { storeFactory } from './mockRedux';
import lightTheme from '../theme/light';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mount, shallow } from 'enzyme';

type RenderParams = Parameters<typeof render>;
type MountParams = Parameters<typeof mount>;
type ShallowParams = Parameters<typeof shallow>;

export const renderWithRouter = (...[ui, option]: [...RenderParams]) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>, option);
};

export const renderWithRouterAndRedux = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(
    <BrowserRouter>
      <Provider store={storeFactory(initStore)}>{ui}</Provider>
    </BrowserRouter>,
    option
  );
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
  return render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>
    </StyledEngineProvider>,
    option
  );
};

export const renderWithThemeAndRedux = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(
    <Provider store={storeFactory(initStore)}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>
      </StyledEngineProvider>
    </Provider>,
    option
  );
};

export const renderWithThemeAndServerRouter = (
  ...[ui, option, props]: [...RenderParams, RouterProps]
) => {
  return render(
    <Router {...props}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>
      </StyledEngineProvider>
    </Router>,
    option
  );
};

export const renderWithThemeAndRouter = (
  ...[ui, option, props]: [...RenderParams, MemoryRouterProps?]
) => {
  return render(
    <MemoryRouter {...props}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>
      </StyledEngineProvider>
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

export const shallowWithRouter = (...[ui, option]: [...ShallowParams]) => {
  return shallow(ui, {
    ...option,
    wrappingComponent: MemoryRouter,
  });
};

export const renderLocationDisplay = (): [
  () => RenderResult,
  () => JSX.Element
] => {
  const LocationComponent = () => {
    const location = useLocation();

    return <div data-testid="location-display">{location.pathname}</div>;
  };

  return [() => renderWithRouter(<LocationComponent />), LocationComponent];
};
