import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import * as React from 'react';
import {
  renderLocationDisplay,
  renderWithRouter,
} from '../../testUtils/customRender';
import { screen } from '@testing-library/react';

describe('test useNavigate', () => {
  beforeEach(() => {
    global.history.pushState({}, '', '/');
  });

  afterEach(() => {});

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
});
