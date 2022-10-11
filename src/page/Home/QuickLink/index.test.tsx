import { fireEvent } from '@testing-library/react';
import QuickLink from '.';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { createMemoryHistory } from 'history';
import { getBySelector } from '../../../testUtils/customQuery';

describe('Home/QuickLink', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should match snapshot', () => {
    const { container } = renderWithRouter(<QuickLink />);
    expect(container).toMatchSnapshot();

    fireEvent.mouseEnter(
      document.getElementsByClassName('fixed-widgets-dashboard-namespace')[0]
    );

    expect(container).toMatchSnapshot();
  });

  test('should execute handleClick when clicking button', () => {
    const history = createMemoryHistory();
    expect(history.location.pathname).toBe('/');
    renderWithServerRouter(<QuickLink />, undefined, {
      history,
    });

    fireEvent.click(getBySelector('button'));
    expect(history.location.pathname).toBe('/order/create');
  });
});
