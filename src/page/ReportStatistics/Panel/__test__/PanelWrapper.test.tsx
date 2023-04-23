import { render, screen } from '@testing-library/react';
import { PanelWrapperProps } from '..';
import PanelWrapper from '../PanelWrapper';

const defaultConfig: PanelWrapperProps = {
  title: 'Title',
  subTitle: 'subTitle',
  loading: false,
  error: null,
};

const children = <span>children</span>;

describe('test PanelWrapper', () => {
  test('should match snapshot', () => {
    const { container } = render(
      <PanelWrapper {...defaultConfig}>{children}</PanelWrapper>
    );

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when loading is equal true', () => {
    const { container } = render(
      <PanelWrapper {...{ ...defaultConfig, loading: true }}>
        {children}
      </PanelWrapper>
    );

    expect(container).toMatchSnapshot();
  });

  test('should render error when error is not undefined', () => {
    const { container } = render(
      <PanelWrapper
        {...{ ...defaultConfig, error: <span>error message</span> }}
      >
        {children}
      </PanelWrapper>
    );

    expect(screen.queryByText('children')).not.toBeInTheDocument();
    expect(screen.getByText('error message')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
