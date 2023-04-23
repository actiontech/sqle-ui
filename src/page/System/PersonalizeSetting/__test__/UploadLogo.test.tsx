import { fireEvent, render, screen, act } from '@testing-library/react';
import configuration from '../../../../api/configuration';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import UploadLogo from '../UploadLogo';

describe('test UploadLogo', () => {
  const refresh = jest.fn();
  const original = window.location;
  const mockReload = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: mockReload },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });

  const mockRequest = () => {
    const spy = jest.spyOn(configuration, 'uploadLogo');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', () => {
    const { container } = render(<UploadLogo refresh={refresh} />);
    expect(container).toMatchSnapshot();
  });

  test('should call upload request when change Upload value', async () => {
    const uploadLogoSpy = mockRequest();
    jest.useFakeTimers();

    render(<UploadLogo refresh={refresh} url="/logo.png" />);
    expect(uploadLogoSpy).toBeCalledTimes(0);

    fireEvent.change(screen.getByTestId('upload-logo'), {
      target: { files: [{ name: 'foo.png' }] },
    });

    await act(async () => jest.advanceTimersByTime(0));

    expect(uploadLogoSpy).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockReload).toBeCalledTimes(1);
    expect(refresh).toBeCalledTimes(1);

    jest.useRealTimers();
  });
});
