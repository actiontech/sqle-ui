import { Space, Typography, Divider, Popconfirm } from 'antd';
import { IAuditWhitelistResV1 } from '../../../api/common.d';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '../../../api/common.enum';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import HighlightCode from '../../../utils/HighlightCode';
import { WhitelistMatchTypeLabel } from '../WhitelistForm';

export const WhitelistColumn = (
  updateWhitelist: (whitelist: IAuditWhitelistResV1) => void,
  deleteWhitelist: (whitelistId: number) => void
): TableColumn<IAuditWhitelistResV1, 'operate'> => {
  return [
    {
      dataIndex: 'value',
      title: () => i18n.t('whitelist.table.sql'),
      render: (sql?: string) => {
        if (!!sql) {
          return (
            <pre
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(sql),
              }}
            />
          );
        }
        return null;
      },
    },
    {
      dataIndex: 'desc',
      title: () => i18n.t('whitelist.table.desc'),
    },
    {
      dataIndex: 'match_type',
      title: () => i18n.t('whitelist.table.matchType'),
      render: (matchType?: CreateAuditWhitelistReqV1MatchTypeEnum) => {
        return matchType ? i18n.t(WhitelistMatchTypeLabel[matchType]) : null;
      },
    },
    {
      dataIndex: 'operate',
      title: () => i18n.t('common.operate'),
      render: (_, record) => (
        <Space>
          <Typography.Link
            className="pointer"
            onClick={updateWhitelist.bind(null, record)}
          >
            {i18n.t('common.edit')}
          </Typography.Link>
          <Divider type="vertical" />
          <Popconfirm
            title={i18n.t('whitelist.operate.confirmDelete')}
            placement="topRight"
            onConfirm={deleteWhitelist.bind(
              null,
              record.audit_whitelist_id ?? 0
            )}
          >
            <Typography.Text type="danger" className="pointer">
              {i18n.t('common.delete')}
            </Typography.Text>
          </Popconfirm>
        </Space>
      ),
    },
  ];
};
