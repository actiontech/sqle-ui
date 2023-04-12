import { Card, Result, Space, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { IPerformanceStatistics } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import IconTipsLabel from '../../../components/IconTipsLabel';
import useBackendTable from '../../../hooks/useBackendTable';
import HighlightCode from '../../../utils/HighlightCode';
import { SQLExecPlanItem } from '../../SqlQuery/index.type';

const useSQLExecPlan = () => {
  const { t } = useTranslation();
  const { tableColumnFactory } = useBackendTable();

  const generateSQLExecPlanContent = <
    T extends Pick<SQLExecPlanItem, 'sql' | 'classic_result' | 'err_message'> &
      IPerformanceStatistics
  >(
    item: T
  ) => {
    const { sql, classic_result: explain, err_message, affect_rows } = item;

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
            columns={tableColumnFactory(explain?.head ?? [], {
              customRender: (v) => v || '-',
            })}
            dataSource={explain?.rows ?? []}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      );
    };

    const renderPerformanceStatistics = () => {
      return (
        <Card title={t('sqlQuery.executePlan.performanceStatistics')}>
          <Card
            style={{ width: '25%' }}
            type="inner"
            title={
              <IconTipsLabel tips={t('sqlQuery.executePlan.affectRowTips')}>
                {t('sqlQuery.executePlan.affectRows')}
              </IconTipsLabel>
            }
          >
            <EmptyBox
              if={!affect_rows?.err_message}
              defaultNode={
                <Typography.Text type="danger">
                  ERROR: {affect_rows?.err_message}
                </Typography.Text>
              }
            >
              <Typography.Text>{affect_rows?.count ?? '--'}</Typography.Text>
            </EmptyBox>
          </Card>
        </Card>
      );
    };

    return (
      <EmptyBox
        if={!err_message}
        defaultNode={<Result status="error" title={err_message} />}
      >
        <Space direction="vertical" className="full-width-element">
          {renderSQL()}
          {renderSQLExplain()}
          {renderPerformanceStatistics()}
        </Space>
      </EmptyBox>
    );
  };

  return {
    generateSQLExecPlanContent,
  };
};

export default useSQLExecPlan;
