import QuickLink from '.';
import { renderWithRouter } from '../../../testUtils/customRender';

describe('Home/QuickLink', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should match snapshot', () => {
    const { container } = renderWithRouter(<QuickLink />);
    expect(container).toMatchSnapshot();
  });
});
