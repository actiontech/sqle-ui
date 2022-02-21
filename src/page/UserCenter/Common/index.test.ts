import generateTag from './generateTag';

describe('test generateTag', () => {
  test('should match snapshot for generateTag', () => {
    const list = ['group1', 'group2'];
    expect(generateTag(list)).toMatchSnapshot();
  });
});
