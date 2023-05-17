import copy from '../Copy';

describe('utils/Copy', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should create element input for copy text', () => {
    const input: any = {
      style: {},
      select: jest.fn(),
      setAttribute: (a: any, b: any) => {
        input[a] = b;
      }
    };
    jest.spyOn(document, 'createElement').mockImplementation(() => input);

    document.execCommand = jest.fn();
    const command = jest.spyOn(document, 'execCommand');
    const appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation((input) => input);
    const removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation((input) => input);

    copy.copyText('123');
    expect(input.style).toEqual({
      position: 'fixed',
      left: '-9999px',
      top: '-9999px',
      opacity: '0'
    });
    expect(appendChildSpy).toBeCalledWith(input);
    expect(input.value).toBe('123');
    expect(input.select).toBeCalledTimes(1);
    expect(command).toBeCalledWith('copy');
    expect(removeChildSpy).toBeCalledWith(input);
  });

  test('should create element textarea for copy textarea text', () => {
    const textarea: any = {
      style: {},
      select: jest.fn(),
      setAttribute: (a: any, b: any) => {
        textarea[a] = b;
      }
    };
    jest.spyOn(document, 'createElement').mockImplementation(() => textarea);

    document.execCommand = jest.fn();
    const appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation((textarea) => textarea);
    const removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation((textarea) => textarea);

    copy.copyTextByTextarea('123');
    expect(textarea.style).toEqual({
      position: 'fixed',
      left: '-9999px',
      top: '-9999px',
      opacity: '0'
    });
    expect(appendChildSpy).toBeCalledWith(textarea);
    expect(textarea.value).toBe('123');
    expect(textarea.select).toBeCalledTimes(1);
    expect(removeChildSpy).toBeCalledWith(textarea);
  });
});
