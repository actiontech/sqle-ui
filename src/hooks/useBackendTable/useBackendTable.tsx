import { Tooltip, Typography } from 'antd';
import { ColumnType } from 'antd/lib/table';

const useBackendTable = () => {
  const tableCellRenderWithEllipsisAndTooltipAndCopyable = (
    text: string
  ): React.ReactNode => {
    return text ? (
      <div style={{ minWidth: 40 }}>
        <Typography.Paragraph copyable={{ text }}>
          <Tooltip title={text}>
            <Typography.Text style={{ maxWidth: 300 }} ellipsis={true}>
              {text}
            </Typography.Text>
          </Tooltip>
        </Typography.Paragraph>
      </div>
    ) : (
      '-'
    );
  };

  const tableColumnFactory = <
    DataSourceItem extends { [key in string]: string },
    T extends Array<{
      desc?: string;
      field_name?: string;
    }>
  >(
    head: T,
    options?: {
      customRender?: (text: string) => React.ReactNode;
    }
  ): ColumnType<DataSourceItem>[] => {
    return head.map((v) => {
      const renderMethod =
        options?.customRender ??
        tableCellRenderWithEllipsisAndTooltipAndCopyable;
      return {
        dataIndex: v.field_name ?? '',
        title: (v.desc || v.field_name) ?? '',
        render: renderMethod,
      };
    });
  };

  return {
    tableColumnFactory,
  };
};

export default useBackendTable;
