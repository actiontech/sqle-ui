import { Card, Result, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../../../components/EmptyBox';
import useBackendTable from '../../../hooks/useBackendTable';
import HighlightCode from '../../../utils/HighlightCode';
import { SQLExecPlanItem } from '../../SqlQuery/index.type';

const useSQLExecPlan = () => {
  const { t } = useTranslation();

  const { tableColumnFactory } = useBackendTable();

  const generateSQLExecPlanContent = <
    T extends Pick<SQLExecPlanItem, 'sql' | 'classic_result' | 'message'>
  >(
    item: T
  ) => {
    const { sql, classic_result: explain, message } = item;

    const renderSQL = () => {
      return (
        <Card title={t('sqlQuery.executePlan.sql')}>
          <pre
            dangerouslySetInnerHTML={{
              __html: HighlightCode.highlightSql(sql ?? ''),
            }}
          />
        </Card>
      );
    };

    const renderSQLExplain = () => {
      return (
        <Card title={t('sqlQuery.executePlan.sqlExplain')}>
          <Table
            columns={tableColumnFactory(explain?.head ?? [])}
            dataSource={explain?.rows ?? []}
            pagination={false}
          />
        </Card>
      );
    };

    return (
      <EmptyBox
        if={!message}
        defaultNode={<Result status="error" title={message} />}
      >
        <Space direction="vertical" className="full-width-element">
          {renderSQL()}
          {renderSQLExplain()}
        </Space>
      </EmptyBox>
    );
  };

  return {
    generateSQLExecPlanContent,
  };
};

export default useSQLExecPlan;
