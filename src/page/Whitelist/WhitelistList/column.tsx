import { Space, Typography, Divider, Popconfirm } from 'antd';
import { IAuditWhitelistResV1 } from '../../../api/common.d';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '../../../api/common.enum';
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import HighlightCode from '../../../utils/HighlightCode';
import { WhitelistMatchTypeLabel } from '../WhitelistForm';

export const WhitelistColumn = (
  updateWhitelist: (whitelist: IAuditWhitelistResV1) => void,
  deleteWhitelist: (whitelistId: number) => void,
  actionPermission: boolean,
  projectIsArchive: boolean
): TableColumn<IAuditWhitelistResV1, 'operator'> => {
  const columns: TableColumn<IAuditWhitelistResV1, 'operator'> = [
    {
      dataIndex: 'value',
      title: () => t('whitelist.table.sql'),
      render: (sql?: string) => {
        if (!!sql) {
          return (
            <pre
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(sql),
              }}
              className="pre-warp-break-all"
            />
          );
        }
        return null;
      },
    },
    {
      dataIndex: 'desc',
      title: () => t('whitelist.table.desc'),
    },
    {
      dataIndex: 'match_type',
      title: () => t('whitelist.table.matchType'),
      render: (matchType?: CreateAuditWhitelistReqV1MatchTypeEnum) => {
        return matchType ? t(WhitelistMatchTypeLabel[matchType]) : null;
      },
    },
    {
      dataIndex: 'operator',
      title: () => t('common.operate'),
      render: (_, record) => (
        <Space>
          <Typography.Link
            className="pointer"
            onClick={updateWhitelist.bind(null, record)}
          >
            {t('common.edit')}
          </Typography.Link>
          <Divider type="vertical" />
          <Popconfirm
            title={t('whitelist.operate.confirmDelete')}
            placement="topRight"
            onConfirm={deleteWhitelist.bind(
              null,
              record.audit_whitelist_id ?? 0
            )}
          >
            <Typography.Text type="danger" className="pointer">
              {t('common.delete')}
            </Typography.Text>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!actionPermission || projectIsArchive) {
    return columns.filter((v) => v.dataIndex !== 'operator');
  }

  return columns;
};
