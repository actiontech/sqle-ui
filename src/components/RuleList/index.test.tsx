import RuleList from '.';
import { fireEvent, render, screen } from '@testing-library/react';
import { IRuleResV1 } from '../../api/common';
import {
  RuleResV1LevelEnum,
  RuleParamResV1TypeEnum,
} from '../../api/common.enum';

const ruleList: IRuleResV1[] = [
  {
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
    desc: 'desc2',
    level: RuleResV1LevelEnum.normal,
    rule_name: 'name2',
    type: 'type2',
  },
  {
    desc: 'desc3',
    level: RuleResV1LevelEnum.notice,
    rule_name: 'name3',
    type: 'type3',
  },
  {
    desc: 'desc4',
    level: RuleResV1LevelEnum.warn,
    rule_name: 'name4',
    type: 'type3',
  },
  {
    desc: 'desc4',
    rule_name: 'name4',
    type: 'type2',
  },
  {
    desc: 'desc4',
    rule_name: 'name4',
    type: 'type1',
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
    fireEvent.click(screen.getByText('type1'));
    fireEvent.click(screen.getByText('type2'));
    fireEvent.click(screen.getByText('type3'));
    expect(container).toMatchSnapshot();
  });

  test('should set active tab by currentTab of props', async () => {
    render(<RuleList list={ruleList} currentTab="type3" />);
    expect(screen.getByText('type3').parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
    fireEvent.click(screen.getByText('type2'));
    expect(screen.getByText('type2').parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
  });
  test('should call update current tab key when user pass tabChang props', async () => {
    const tabChangeFn = jest.fn();
    render(
      <RuleList list={ruleList} currentTab="type3" tabChange={tabChangeFn} />
    );
    expect(screen.getByText('type3').parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
    fireEvent.click(screen.getByText('type2'));
    expect(tabChangeFn).toBeCalledWith('type2');
    expect(screen.getByText('type3').parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
  });
  test('should render rule value list when params in the item', () => {
    render(<RuleList list={ruleList} />);
    expect(screen.queryByText('desc1_1:')).toBeInTheDocument();
    expect(screen.queryByText('true')).toBeInTheDocument();
    expect(screen.queryByText('desc1_3:')).toBeInTheDocument();
    expect(screen.queryByText('val')).toBeInTheDocument();
  });
});
