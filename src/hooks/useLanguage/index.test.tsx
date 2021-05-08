import { languageData } from '.';
import moment from 'moment';
import { renderHooksWithRedux } from '../../testUtils/customRender';
import useLanguage from '.';
import { SupportLanguage } from '../../locale';
import { mockUseDispatch } from '../../testUtils/mockRedux';
import { useTranslation } from 'react-i18next';

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

describe('useLanguage', () => {
  let i18nChangeLanguage: jest.Mock;
  beforeEach(() => {
    i18nChangeLanguage = jest.fn();
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        changeLanguage: i18nChangeLanguage,
      },
    } as any);
    jest.useFakeTimers();
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
    const { result } = renderHooksWithRedux(() => useLanguage(), {
      locale: { language: SupportLanguage.zhCN },
    });
    expect(result.current.antdLocale).toBe(
      languageData[SupportLanguage.zhCN].antd
    );
    const { result: resultEn } = renderHooksWithRedux(() => useLanguage(), {
      locale: { language: SupportLanguage.enUS },
    });
    expect(resultEn.current.antdLocale).toBe(
      languageData[SupportLanguage.enUS].antd
    );
  });

  test('should dispatch update language action when language in redux is invalid', async () => {
    const { scopeDispatch } = mockUseDispatch();
    renderHooksWithRedux(() => useLanguage(), {
      locale: { language: 'xxxxx' },
    });
    expect(scopeDispatch).toBeCalledTimes(1);
    expect(scopeDispatch).toBeCalledWith({
      type: 'locale/updateLanguage',
      payload: {
        language: SupportLanguage.zhCN,
      },
    });
  });

  test('should set language for moment and i18n', async () => {
    const { scopeDispatch } = mockUseDispatch();
    const momentLocalSpy = mockMoment();
    renderHooksWithRedux(() => useLanguage(), {
      locale: { language: SupportLanguage.zhCN },
    });
    expect(scopeDispatch).not.toBeCalled();
    expect(momentLocalSpy).toBeCalledTimes(1);
    expect(momentLocalSpy).toBeCalledWith(
      languageData[SupportLanguage.zhCN].moment
    );
    expect(i18nChangeLanguage).toBeCalledTimes(1);
    expect(i18nChangeLanguage).toBeCalledWith(SupportLanguage.zhCN);
  });
});
