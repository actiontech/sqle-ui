import { Result, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { ICommonTableProps } from '.';
import { commonColumn } from './column';

const CommonTable: React.FC<ICommonTableProps> = ({
  tableInfo,
  customColumn,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Table
        rowKey="subject"
        bordered
        loading={tableInfo.loading}
        scroll={{ x: 'max-content' }}
        pagination={false}
        locale={{
          emptyText: tableInfo.error ? (
            <Result
              status="error"
              title={t('common.request.noticeFailTitle')}
              subTitle={tableInfo.error?.message ?? t('common.unknownError')}
            />
          ) : undefined,
        }}
        dataSource={tableInfo.data ?? []}
        columns={
          typeof customColumn === 'function' ? customColumn() : commonColumn()
        }
      />
    </>
  );
};

export default CommonTable;
