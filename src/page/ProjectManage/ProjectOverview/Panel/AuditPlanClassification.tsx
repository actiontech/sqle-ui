import { Result, Space, Typography } from 'antd';
import PanelWrapper from './PanelWrapper';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../../components/Link';
import { PanelCommonProps } from '.';
import { Column, ColumnConfig } from '@ant-design/plots';
import { useMemo, useState } from 'react';
import { projectOverviewData } from '../index.data';
import usePanelCommonRequest from './usePanelCommonRequest';
import statistic from '../../../../api/statistic';

const { rowHeight, thirdLineSize } = projectOverviewData;

const config: ColumnConfig = {
  data: [],
  xField: 'type',
  yField: 'value',
  isStack: true,
  seriesField: 'category',
  color: ['#fbd44d', '#43cb77', '#42a2ff'],
  minColumnWidth: 6,
  maxColumnWidth: 40,
  legend: {
    position: 'bottom',
  },
  tooltip: {
    shared: false,
  },
};

const AuditPlanClassification: React.FC<PanelCommonProps> = ({
  projectName,
  commonPadding,
  currentTheme,
  language,
}) => {
  const { t } = useTranslation();
  const height = useMemo(() => {
    return (
      rowHeight * thirdLineSize[0].h +
      commonPadding * (thirdLineSize[0].h - 1) -
      80
    );
  }, [commonPadding]);

  const [data, setData] = useState<ColumnConfig['data']>([
    {
      type: 'MySQL',
      value: 0,
    },
  ]);

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.statisticAuditPlanV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        const dbTypeAuditPlans = res.data.data ?? [];
        if (dbTypeAuditPlans.length > 0) {
          setData(
            dbTypeAuditPlans.reduce<
              Array<{
                type: string;
                value: number;
                category: string;
              }>
            >((acc, cur) => {
              const currentTypes = (cur.data ?? []).map((v) => ({
                type: cur.db_type ?? '',
                value: v.audit_plan_count ?? 0,
                category: v.audit_plan_desc ?? '',
              }));

              return [...acc, ...currentTypes];
            }, [])
          );
        }
      },
    }
  );

  return (
    <PanelWrapper
      loading={loading}
      error={
        errorMessage ? (
          <Result
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={errorMessage}
          />
        ) : null
      }
      title={
        <Space size={12}>
          <Typography.Text>
            {t('projectManage.projectOverview.auditPlanClassification.title')}
          </Typography.Text>

          <Link
            to={`project/${projectName}/auditPlan/create`}
            className="font-size-small"
          >
            {t('auditPlan.action.create')}
          </Link>
        </Space>
      }
    >
      <Column
        {...{ ...config, data }}
        theme={currentTheme}
        locale={language}
        height={height}
      />
    </PanelWrapper>
  );
};

export default AuditPlanClassification;
