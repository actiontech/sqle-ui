import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Table } from 'antd';
import useBackendTable from './useBackendTable';

describe('useBackendTable', () => {
  const testData = [
    {
      head: [
        {
          desc: 'a1',
          field_name: 'a',
        },
        {
          desc: 'b1',
          field_name: 'b',
        },
      ],
      dataSource: [
        {
          a: 'test-a-1',
          b: 'test-b-1',
        },
        {
          a: 'test-a-2',
          b: 'test-b-2',
        },
      ],
    },
    {
      head: [
        {
          field_name: 'a',
        },
        {
          field_name: 'b',
        },
      ],
      dataSource: [
        {
          a: 'test-a-1',
          b: 'test-b-1',
        },
        {
          a: 'test-a-2',
          b: 'test-b-2',
        },
      ],
    },
    {
      head: [
        {
          field_name: 'a',
          desc: '',
        },
        {
          field_name: 'b',
          desc: '',
        },
      ],
      dataSource: [
        {
          a: 'test-a-1',
          b: 'test-b-1',
        },
        {
          a: 'test-a-2',
          b: 'test-b-2',
        },
      ],
    },
  ];

  it('should render table by "head" fields', () => {
    const { result } = renderHook(() => useBackendTable());

    testData.forEach((v) => {
      const { head, dataSource } = v;
      const columns = result.current.tableColumnFactory(head);
      const table = (
        <Table rowKey={(e) => e.a} columns={columns} dataSource={dataSource} />
      );
      const { container } = render(table);
      expect(container).toMatchSnapshot();
    });
  });
});
