import RuleList from '.';
import { render, screen } from '@testing-library/react';
import { IRuleResV1 } from '../../api/common';
import { RuleResV1LevelEnum } from '../../api/common.enum';

describe('RuleList', () => {
  test('should render empty text when list is empty array', () => {
    render(<RuleList list={[]} />);
    expect(
      screen.getByText('ruleTemplate.ruleTemplateForm.emptyRule')
    ).toBeInTheDocument();
  });

  test('should render rule list when list is not empty array', () => {
    const ruleList: IRuleResV1[] = [
      {
        desc: 'desc1',
        level: RuleResV1LevelEnum.normal,
        rule_name: 'name1',
      },
      {
        desc: 'desc2',
        level: RuleResV1LevelEnum.normal,
        rule_name: 'name2',
        value: '123',
      },
      {
        desc: 'desc3',
        level: RuleResV1LevelEnum.notice,
        rule_name: 'name3',
      },
      {
        desc: 'desc4',
        level: RuleResV1LevelEnum.warn,
        rule_name: 'name4',
        value: '333',
      },
      {
        desc: 'desc4',
        rule_name: 'name4',
      },
      {
        desc: 'desc4',
        rule_name: 'name4',
        value: '4444',
      },
    ];
    const { container } = render(<RuleList list={ruleList} />);
    expect(container).toMatchSnapshot();
  });
});
