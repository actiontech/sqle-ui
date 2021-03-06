import { render, screen } from '@testing-library/react';
import { IWorkflowDetailResV1 } from '../../../api/common';
import CommonTable, { CommonTableInfoType, genTabPaneTitle } from './index';
import { renderWithRouter } from '../../../testUtils/customRender';
import { TableColumn } from '../../../types/common.type';

const list: IWorkflowDetailResV1[] = [
  {
    subject: 'test1',
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

  test('should render error info when error has a value', () => {
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
          dataIndex: 'subject',
          title: () => 'subject',
        },
        {
          dataIndex: 'desc',
          title: () => 'desc',
        },
        {
          dataIndex: 'workflow_id',
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
});
