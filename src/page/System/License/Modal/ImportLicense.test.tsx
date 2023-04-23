import { cleanup, fireEvent, screen, act } from '@testing-library/react';
import configuration from '../../../../api/configuration';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { renderWithRedux } from '../../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import { licenseList } from '../__testData__';
import ImportLicense from './ImportLicense';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('Import License', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        system: {
          modalStatus: {
            [ModalName.Import_License]: true,
          },
        },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should match snapshot', () => {
    const { baseElement } = renderWithRedux(<ImportLicense />);
    expect(baseElement).toMatchSnapshot();
    cleanup();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        system: {
          modalStatus: {
            [ModalName.Import_License]: false,
          },
        },
      })
    );
    const { baseElement: empty } = renderWithRedux(<ImportLicense />);
    expect(empty).toMatchSnapshot();
  });

  it('should import license file', async () => {
    const { baseElement } = renderWithRedux(<ImportLicense />);
    const checkSpy = jest.spyOn(configuration, 'checkSQLELicenseV1');
    checkSpy.mockImplementation(() =>
      resolveThreeSecond(
        {},
        {
          otherData: {
            license: licenseList,
          },
        }
      )
    );
    const file = new File(
      [new Blob(['aaa.license'], { type: 'text/plain' })],
      'test.license'
    );
    fireEvent.change(screen.getByLabelText('system.license.form.licenseFile'), {
      target: { files: [file] },
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(checkSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
    const importSpy = jest.spyOn(configuration, 'setSQLELicenseV1');
    importSpy.mockImplementation(() => resolveThreeSecond({}));
    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(importSpy).toBeCalledTimes(1);
    expect(importSpy).toBeCalledWith({
      license_file: file,
    });
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toHaveAttribute(
      'disabled'
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'Import_License',
        status: false,
      },
      type: 'system/updateModalStatus',
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).not.toHaveAttribute(
      'disabled'
    );
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_License);
    expect(
      screen.getByText('system.license.importSuccessTips')
    ).toBeInTheDocument();
  });
});
