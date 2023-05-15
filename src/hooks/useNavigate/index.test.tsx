import { Route, Routes, useParams } from 'react-router-dom';
import * as React from 'react';
import {
  renderLocationDisplay,
  renderWithRouter,
} from '../../testUtils/customRender';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import useNavigate from '.';
import { SQLE_BASE_URL } from '../../data/common';

describe('test useNavigate', () => {
  beforeEach(() => {
    global.history.pushState({}, '', '/');
  });

  afterEach(() => {
    cleanup();
  });

  test('correctly jump to the specified url', () => {
    const Start = () => {
      const navigate = useNavigate();
      React.useEffect(() => {
        navigate('/blog');
      });
      return null;
    };
    const [, LocationComponent] = renderLocationDisplay();

    renderWithRouter(
      <>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/blog" element={<LocationComponent />} />
        </Routes>
      </>
    );

    expect(window.location.pathname).toEqual('/blog');
    expect(screen.getByTestId('location-display')).toHaveTextContent('/blog');
  });

  test('correctly encodes the param in the URL and decodes the param when it is used', () => {
    const Start = () => {
      const navigate = useNavigate();
      React.useEffect(() => {
        navigate('/blog/react router');
      });
      return null;
    };

    const Blog = () => {
      let params = useParams();
      return <h1>Blog: {params.slug}</h1>;
    };

    const { container } = renderWithRouter(
      <>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="blog/:slug" element={<Blog />} />
        </Routes>
      </>
    );

    expect(window.location.pathname).toEqual('/blog/react%20router');
    expect(screen.getByText('Blog: react router')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('should be added custom prefix', () => {
    const Start = () => {
      const navigate = useNavigate();
      React.useEffect(() => {
        navigate('blog');
      });
      return null;
    };

    const Button = () => {
      const navigate = useNavigate();
      return (
        <button
          onClick={() => {
            navigate({ pathname: 'search', search: '123' }, { replace: true });
          }}
        >
          click
        </button>
      );
    };
    const [, LocationComponent] = renderLocationDisplay();

    renderWithRouter(
      <>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route
            path={`${SQLE_BASE_URL}search`}
            element={<LocationComponent />}
          />
          <Route
            path={`${SQLE_BASE_URL}blog`}
            element={
              <>
                <LocationComponent /> <Button />
              </>
            }
          />
        </Routes>
      </>
    );

    expect(window.location.pathname).toEqual(`${SQLE_BASE_URL}blog`);
    expect(screen.getByTestId('location-display')).toHaveTextContent(
      `${SQLE_BASE_URL}blog`
    );

    fireEvent.click(screen.getByText('click'));

    expect(screen.getByTestId('location-display')).toHaveTextContent(
      `${SQLE_BASE_URL}search`
    );
    expect(window.location.search).toBe('?123');
  });

  test('should be returned to the previous page when called "navigate(-1)"', () => {
    const Start = () => {
      const navigate = useNavigate();

      return (
        <>
          <LocationComponent />
          <button
            onClick={() => {
              navigate({ pathname: '/blog', search: '123' }, { replace: true });
            }}
          >
            click
          </button>
        </>
      );
    };

    const Blog = () => {
      const navigate = useNavigate();

      return (
        <>
          <LocationComponent />
          <button
            onClick={() => {
              navigate(-1);
            }}
          >
            back
          </button>
        </>
      );
    };
    const [, LocationComponent] = renderLocationDisplay();

    renderWithRouter(
      <>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path={`/blog`} element={<Blog />} />
        </Routes>
      </>
    );

    fireEvent.click(screen.getByText('click'));
    expect(screen.getByTestId('location-display')).toHaveTextContent(`/blog`);

    fireEvent.click(screen.getByText('back'));
    expect(screen.getByTestId('location-display')).toHaveTextContent(`/`);
  });
});
