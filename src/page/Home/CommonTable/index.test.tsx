import { render, screen } from '@testing-library/react';
import { IWorkflowDetailResV1 } from '../../../api/common';
import CommonTable, { CommonTableInfoType, genTabPaneTitle } from './index';
import { renderWithRouter } from '../../../testUtils/customRender';
import { TableColumn } from '../../../types/common.type';
import { getHrefByText } from '../../../testUtils/customQuery';

const list: IWorkflowDetailResV1[] = [
  {
    workflow_id: '1',
    workflow_name: 'test1',
    project_name: 'default',
    desc: 'desc1',
    create_time: '',
  },
];

let mockTableInfo: CommonTableInfoType = {
  loading: false,
  data: list,
  error: undefined,
};

describe('test Home/genTabPaneTitle', () => {
  test('should match snapshot', () => {
    expect(genTabPaneTitle('title')).toMatchSnapshot();
    expect(genTabPaneTitle('title', 12)).toMatchSnapshot();
    expect(genTabPaneTitle('title', 101)).toMatchSnapshot();
  });

  test('should only render the title when badgeCount is zero or undefined', () => {
    const Element = genTabPaneTitle('title');
    render(Element as JSX.Element);
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(document.querySelector('.tabs-panel-badge')).toBeNull();
  });

  test('should be rendered badge count when badgeCount is not zero or has been defined', () => {
    const Element = genTabPaneTitle('title', 88);
    render(Element as JSX.Element);
    expect(document.querySelector('.tabs-panel-badge')).not.toBeNull();
    expect(Element).toMatchSnapshot();
  });

  test('should be rendered 99+ when badgeCount number is greater than 99', () => {
    const Element = genTabPaneTitle('title', 128);
    render(Element as JSX.Element);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });
});

describe('test Home/CommonTable', () => {
  afterEach(() => {
    mockTableInfo = {
      loading: false,
      data: list,
      error: undefined,
    };

    jest.clearAllMocks();
  });

  test('should match snapshot', () => {
    const { container } = renderWithRouter(
      <CommonTable tableInfo={mockTableInfo} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should render spin when loading equal true', () => {
    mockTableInfo.loading = true;
    const { container } = renderWithRouter(
      <CommonTable tableInfo={mockTableInfo} />
    );
    expect(container).toMatchSnapshot();
  });

  test.skip('should render error info when error has a value', () => {
    mockTableInfo.error = new Error('error message');
    mockTableInfo.data = [];
    const { container } = renderWithRouter(
      <CommonTable tableInfo={mockTableInfo} />
    );

    expect(container).toMatchSnapshot();
    expect(
      screen.getByText('common.request.noticeFailTitle')
    ).toBeInTheDocument();
    expect(screen.getByText('error message')).toBeInTheDocument();
  });

  test('should render custom custom when custom has a value', () => {
    const mockCustomColumn = jest
      .fn<TableColumn<IWorkflowDetailResV1>, any>()
      .mockReturnValue([
        {
          dataIndex: 'workflow_name',
          title: () => 'subject',
        },
        {
          dataIndex: 'desc',
          title: () => 'desc',
        },
        {
          dataIndex: 'workflow_name',
          title: () => 'workflow_id',
        },
      ]);
    const { container, rerender } = renderWithRouter(
      <CommonTable tableInfo={mockTableInfo} />
    );

    expect(mockCustomColumn).toBeCalledTimes(0);

    rerender(
      <CommonTable tableInfo={mockTableInfo} customColumn={mockCustomColumn} />
    );
    expect(mockCustomColumn).toBeCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  test('should jump to the order page under the project when click on the corresponding link', () => {
    renderWithRouter(<CommonTable tableInfo={mockTableInfo} />);

    expect(screen.getByText(list[0].workflow_name!)).toBeInTheDocument();
    expect(getHrefByText(list[0].workflow_name!)).toBe(
      `/project/${list[0].project_name}/order/${list[0].workflow_id}`
    );

    expect(screen.getByText(list[0].project_name!)).toBeInTheDocument();
    expect(getHrefByText(list[0].project_name!)).toBe(
      `/project/${list[0].project_name}/overview`
    );
  });
});
