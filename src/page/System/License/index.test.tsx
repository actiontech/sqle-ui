import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import License from '.';
import configuration from '../../../api/configuration';
import EmitterKey from '../../../data/EmitterKey';
import { renderWithRedux } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { licenseList } from './__testData__';

describe('license', () => {
  let dispatchSpy: jest.SpyInstance;
  let getLicenseSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getLicenseSpy = mockGetLicense();
    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseSelector({
      system: { modalStatus: {} },
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const mockGetLicense = () => {
    const spy = jest.spyOn(configuration, 'getSQLELicenseV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(
        {},
        {
          otherData: {
            license: licenseList,
          },
        }
      );
    });
    return spy;
  };

  it('should match snapshot', async () => {
    const { container } = renderWithRedux(<License />);
    expect(container).toMatchSnapshot();
    expect(getLicenseSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  it('should send collect license request when user click collect button', async () => {
    const collectSpy = jest.spyOn(configuration, 'GetSQLELicenseInfoV1');
    collectSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithRedux(<License />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('system.license.collect'));
    expect(collectSpy).toBeCalledTimes(1);
  });

  it('should open import modal when user click import button', async () => {
    renderWithRedux(<License />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('system.license.import'));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'Import_License',
        status: true,
      },
      type: 'system/updateModalStatus',
    });
  });

  it('should refresh table when receive refresh license event', async () => {
    renderWithRedux(<License />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getLicenseSpy).toBeCalledTimes(1);
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_License);
    });
    expect(getLicenseSpy).toBeCalledTimes(2);
  });
});
