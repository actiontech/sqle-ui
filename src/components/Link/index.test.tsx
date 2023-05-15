import { cleanup } from '@testing-library/react';
import { Link } from '.';
import { SQLE_BASE_URL } from '../../data/common';
import { getHrefByText } from '../../testUtils/customQuery';
import { renderWithRouter } from '../../testUtils/customRender';

describe('test CustomLink', () => {
  afterEach(() => {
    cleanup();
  });
  test('should render href', () => {
    renderWithRouter(<Link to="/test">test</Link>);

    expect(getHrefByText('test')).toBe('/test');
  });

  test('should be add custom prefix', () => {
    renderWithRouter(<Link to="test">test</Link>);
    expect(getHrefByText('test')).toBe(`${SQLE_BASE_URL}test`);
    cleanup();

    renderWithRouter(<Link to={`${SQLE_BASE_URL}test`}>test</Link>);
    expect(getHrefByText('test')).toBe(`${SQLE_BASE_URL}test`);
    cleanup();

    renderWithRouter(
      <Link to={{ pathname: 'test', search: '123' }}>test</Link>
    );
    expect(getHrefByText('test')).toBe(`${SQLE_BASE_URL}test?123`);
    cleanup();

    renderWithRouter(
      <Link to={{ pathname: `${SQLE_BASE_URL}test`, search: '123' }}>test</Link>
    );
    expect(getHrefByText('test')).toBe(`${SQLE_BASE_URL}test?123`);

    cleanup();

    renderWithRouter(<Link to={{ pathname: undefined }}>test</Link>);
    expect(getHrefByText('test')).toBe('/');
  });
});
