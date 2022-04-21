import { fireEvent, render, waitFor } from '@testing-library/react';
import { getBySelector } from '../../testUtils/customQuery';
import IconTipsLabel from './IconTipsLabel';

describe('IconTipsLabel', () => {
  it('should match snapshot', async () => {
    jest.useFakeTimers();
    const { baseElement } = render(
      <IconTipsLabel tips="this is tips">
        <p>123</p>
      </IconTipsLabel>
    );

    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseEnter(getBySelector('.text-orange'));

    await waitFor(() => {
      jest.runAllTimers();
    });

    expect(baseElement).toMatchSnapshot();
    jest.useRealTimers();
  });
});
