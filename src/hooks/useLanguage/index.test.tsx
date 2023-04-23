import { languageData } from '.';
import moment from 'moment';
import useLanguage from '.';
import { SupportLanguage } from '../../locale';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('react-i18next', () => {
  return {
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn().mockReturnValue({
      i18n: {
        changeLanguage: jest.fn(),
      },
    }),
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('useLanguage', () => {
  let i18nChangeLanguage: jest.Mock;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    i18nChangeLanguage = jest.fn();
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        changeLanguage: i18nChangeLanguage,
      },
    } as any);
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    i18nChangeLanguage.mockClear();
  });

  const mockMoment = () => {
    const spy = jest.spyOn(moment, 'locale');
    return spy;
  };

  test('should return antd locale by redux language', () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        locale: { language: SupportLanguage.zhCN },
      })
    );
    const { result } = renderHook(() => useLanguage());
    expect(result.current.antdLocale).toBe(
      languageData[SupportLanguage.zhCN].antd
    );

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        locale: { language: SupportLanguage.enUS },
      })
    );
    const { result: resultEn } = renderHook(() => useLanguage());
    expect(resultEn.current.antdLocale).toBe(
      languageData[SupportLanguage.enUS].antd
    );
  });

  test('should dispatch update language action when language in redux is invalid', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        locale: { language: 'xxxxx' },
      })
    );
    renderHook(() => useLanguage());
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'locale/updateLanguage',
      payload: {
        language: SupportLanguage.zhCN,
      },
    });
  });

  test('should set language for moment and i18n', async () => {
    const momentLocalSpy = mockMoment();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        locale: { language: SupportLanguage.zhCN },
      })
    );
    renderHook(() => useLanguage());
    expect(dispatchSpy).not.toBeCalled();
    expect(momentLocalSpy).toBeCalledTimes(1);
    expect(momentLocalSpy).toBeCalledWith(
      languageData[SupportLanguage.zhCN].moment
    );
    expect(i18nChangeLanguage).toBeCalledTimes(1);
    expect(i18nChangeLanguage).toBeCalledWith(SupportLanguage.zhCN);
  });
});
