import QuickLink from '.';
import { SystemRole } from '../../../data/common';
import { renderWithRouter } from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';

describe('Home/QuickLink', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render quick link when user role is not admin', () => {
    mockUseSelector({ user: { role: '' } });
    const { container } = renderWithRouter(<QuickLink />);
    expect(container).toMatchSnapshot();
  });

  test('should render quick link when user role is admin', () => {
    mockUseSelector({ user: { role: SystemRole.admin } });
    const { container } = renderWithRouter(<QuickLink />);
    expect(container).toMatchSnapshot();
  });
});
