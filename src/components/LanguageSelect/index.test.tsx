import { fireEvent, render, screen } from '@testing-library/react';
import LanguageSelect from '.';
import { mockUseDispatch, mockUseSelector } from '../../testUtils/mockRedux';
import { SupportLanguage } from '../../locale';

describe('LanguageSelect', () => {
  const useSelectorSpy = mockUseSelector();
  mockUseDispatch();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  test('should render all support language option in select', async () => {
    useSelectorSpy.mockReturnValue(SupportLanguage.zhCN);
    const { baseElement } = render(<LanguageSelect />);
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(screen.getByText('中文'));
    jest.runAllTimers();
    await screen.findByText('English');
    expect(baseElement).toMatchSnapshot();
  });
});
