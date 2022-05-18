import { ThemeProvider } from '@material-ui/styles';
import SqlQuery from '.';
import { renderWithRedux } from '../../testUtils/customRender';
import lightTheme from '../../theme/light';

describe('SqlQuery', () => {
  test('should match snapshot', () => {
    const { container } = renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlQuery />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
