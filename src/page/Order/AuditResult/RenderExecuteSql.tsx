import { Space, Typography } from 'antd';
import HighlightCode from '../../../utils/HighlightCode';
import { RenderExecuteSqlProps } from './index.type';
import CopyIcon from '../../../components/CopyIcon';

const RenderExecuteSql: React.FC<RenderExecuteSqlProps> = ({
  sql,
  rows = 10,
}) => {
  if (!sql) {
    return null;
  }

  return (
    <Space>
      <Typography.Paragraph
        ellipsis={{
          expandable: false,
          tooltip: {
            title: <pre className="pre-warp-break-all">{sql}</pre>,
            placement: 'topLeft',
            overlayInnerStyle: {
              width: '30vw',
            },
          },
          rows,
        }}
        className="margin-bottom-0"
      >
        <span
          dangerouslySetInnerHTML={{ __html: HighlightCode.highlightSql(sql) }}
        />
      </Typography.Paragraph>
      <CopyIcon text={sql} />
    </Space>
  );
};

export default RenderExecuteSql;
