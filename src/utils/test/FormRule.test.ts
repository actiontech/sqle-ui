import {
  nameRuleValidator,
  phoneRuleValidator,
  tagNameRuleValidator,
  validatorPort,
} from '../FormRule';

describe('utils/FormRule', () => {
  test('should check name must start with letter and only includes letters and number and some special char', async () => {
    const check = nameRuleValidator();
    let message = '';
    try {
      await check({} as any, '1xxxx', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('common.form.rule.startWithLetter');
    try {
      await Promise.all([
        check({} as any, 'xx123xzxc xx', () => {}),
        check({} as any, 'xx123xz+xcxx', () => {}),
      ]);
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('common.form.rule.onlyLetterAndNumber');
    const res = await Promise.all([
      check({} as any, 'xx123xzxcxx', () => {}),
      check({} as any, 'xx123xzxc000xx', () => {}),
      check({} as any, 'Xx123xzxc000xx', () => {}),
    ]);
    expect(res.every((e) => e === undefined)).toBe(true);
  });

  test('should check prot is between min and max', async () => {
    const cases = [
      {
        min: undefined,
        max: undefined,
        value: 'aaa',
        message: 'common.form.rule.onlyNumber',
      },
      {
        min: undefined,
        max: undefined,
        value: '123',
        message: undefined,
      },
      {
        min: undefined,
        max: undefined,
        value: '0',
        message: 'common.form.rule.portRange',
      },
      {
        min: undefined,
        max: undefined,
        value: '65536',
        message: 'common.form.rule.portRange',
      },
      {
        min: 100,
        max: 120,
        value: '200',
        message: 'common.form.rule.portRange',
      },
    ];
    for (const c of cases) {
      let message = '';
      const validator = validatorPort(c.min, c.max);
      try {
        message = await validator({} as any, c.value, () => {});
      } catch (error: any) {
        message = error;
      }
      expect(message).toBe(c.message);
    }
  });

  test('should check phone', async () => {
    const check = phoneRuleValidator();
    let message = '';
    try {
      await check({} as any, '1123456789', () => {});
    } catch (error: any) {
      message = error;
    }

    expect(message).toBe('common.form.rule.phone');

    message = '';
    try {
      await check({} as any, '112345678912', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('common.form.rule.phone');

    message = '';
    try {
      await check({} as any, '1123456789d', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('common.form.rule.phone');

    message = '';
    try {
      await check({} as any, '13412341234', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');

    message = '';
    try {
      await check({} as any, '', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');
  });

  test('should check tag name', async () => {
    const check = tagNameRuleValidator();
    let message = '';

    try {
      await check({} as any, '1123456789', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');

    try {
      await check({} as any, '范德萨', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');

    try {
      await check({} as any, 'test', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');

    try {
      await check({} as any, '_', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');

    try {
      await check({} as any, '-', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');

    try {
      await check({} as any, '1ha哈_-', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');

    try {
      await check({} as any, '哈1ha-_-', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');

    try {
      await check({} as any, '1ha哈_-#', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('common.form.rule.allowedCharacters');
  });
});
