import RuleList from '.';
import { fireEvent, render, screen } from '@testing-library/react';
import { IRuleResV1 } from '../../api/common';
import {
  RuleResV1LevelEnum,
  RuleParamResV1TypeEnum,
} from '../../api/common.enum';

const ruleList: IRuleResV1[] = [
  {
    annotation: 'annotation1',
    desc: 'desc1',
    level: RuleResV1LevelEnum.normal,
    rule_name: 'name1',
    type: 'type1',
    params: [
      {
        key: 'key1_1',
        desc: 'desc1_1',
        type: RuleParamResV1TypeEnum.int,
      },
      {
        key: 'key1_2',
        type: RuleParamResV1TypeEnum.bool,
        value: 'true',
      },
      {
        key: 'key1_3',
        desc: 'desc1_3',
        type: RuleParamResV1TypeEnum.string,
        value: 'val',
      },
    ],
  },
  {
    annotation: 'annotation2',
    desc: 'desc2',
    level: RuleResV1LevelEnum.normal,
    rule_name: 'name2',
    type: 'type2',
  },
  {
    annotation: 'annotation3',
    desc: 'desc3',
    level: RuleResV1LevelEnum.notice,
    rule_name: 'name3',
    type: 'type3',
  },
  {
    annotation: 'annotation4',
    desc: 'desc4',
    level: RuleResV1LevelEnum.warn,
    rule_name: 'name4',
    type: 'type3',
  },
  {
    annotation: 'annotation5',
    desc: 'desc4',
    rule_name: 'name4',
    type: 'type2',
  },
  {
    annotation: 'annotation6',
    desc: 'desc4',
    rule_name: 'name4',
    type: 'type1',
  },
  {
    annotation: 'annotation7',
    desc: 'desc7',
    rule_name: 'name7',
    type: '111',
  },
  {
    annotation: 'annotation7',
    desc: 'desc7',
    rule_name: 'name7',
    type: '222',
  },
];

describe('RuleList', () => {
  test('should render empty text when list is empty array', () => {
    render(<RuleList list={[]} />);
    expect(
      screen.getByText('ruleTemplate.ruleTemplateForm.emptyRule')
    ).toBeInTheDocument();
  });

  test('should render rule list when list is not empty array', () => {
    const { container } = render(<RuleList list={ruleList} />);
    fireEvent.click(screen.getByText(/type1\s\(2\)/));
    fireEvent.click(screen.getByText(/type2\s\(2\)/));
    fireEvent.click(screen.getByText(/type3\s\(2\)/));
    expect(container).toMatchSnapshot();
  });

  test('should set active tab by currentTab of props', async () => {
    render(<RuleList list={ruleList} currentTab="type3" />);
    expect(screen.getByText(/type3\s\(2\)/).parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
    fireEvent.click(screen.getByText(/type2\s\(2\)/));
    expect(screen.getByText(/type2\s\(2\)/).parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
  });
  test('should call update current tab key when user pass tabChang props', async () => {
    const tabChangeFn = jest.fn();
    render(
      <RuleList list={ruleList} currentTab="type3" tabChange={tabChangeFn} />
    );
    expect(screen.getByText(/type3\s\(2\)/).parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
    fireEvent.click(screen.getByText(/type2\s\(2\)/));
    expect(tabChangeFn).toBeCalledWith('type2');
    expect(screen.getByText(/type3\s\(2\)/).parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
  });
  test('should render rule value list when params in the item', () => {
    render(<RuleList list={ruleList} />);
    expect(screen.getByText('desc1_1:')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
    expect(screen.getByText('desc1_3:')).toBeInTheDocument();
    expect(screen.getByText('val')).toBeInTheDocument();
  });

  test('should be guaranteed that ALL is always at the first position of the tab', () => {
    const { container } = render(
      <RuleList list={ruleList} tabChange={jest.fn()} />
    );

    expect(container).toMatchSnapshot();
  });
});
