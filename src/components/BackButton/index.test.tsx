import { fireEvent, render, screen } from '@testing-library/react';
import BackButton from '.';
import useBack from '../../hooks/useBack';

jest.mock('../../hooks/useBack', () => {
  const goBack = jest.fn();
  return () => ({
    goBack,
  });
});

describe('BackButton', () => {
  const goBack = useBack().goBack as jest.Mock;

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should render a button', () => {
    const { container } = render(<BackButton />);
    expect(container).toMatchSnapshot();
  });

  test('should call goBack function when click the button', () => {
    render(<BackButton />);
    fireEvent.click(screen.getByText('common.back'));

    expect(goBack).toBeCalledTimes(1);
  });
});
