import { nameRuleValidator } from '../FormRule';

describe('utils/FormRule', () => {
  test('should check name must start with letter and only includes letters and number and some special char', async () => {
    const check = nameRuleValidator();
    let message = '';
    try {
      await check({} as any, '1xxxx', () => {});
    } catch (error) {
      message = error;
    }
    expect(message).toBe('common.form.rule.startWithLetter');
    try {
      await Promise.all([
        check({} as any, 'xx123xzxc xx', () => {}),
        check({} as any, 'xx123xz+xcxx', () => {}),
      ]);
    } catch (error) {
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
});
