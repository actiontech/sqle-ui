import { Result, Table, Typography } from 'antd';
import PanelWrapper from './PanelWrapper';
import { useTranslation } from 'react-i18next';
import { projectOverviewData } from '../index.data';
import { PanelCommonProps } from '.';
import { Link } from '../../../../components/Link';
import usePanelCommonRequest from './usePanelCommonRequest';
import statistic from '../../../../api/statistic';
import { useMemo, useState } from 'react';
import { IRiskAuditPlan } from '../../../../api/common';

const { tableColumns, tableCommonProps, thirdLineSize, rowHeight } =
  projectOverviewData;

const AuditPlanRisk: React.FC<
  Pick<PanelCommonProps, 'projectName' | 'commonPadding'>
> = ({ projectName, commonPadding }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<IRiskAuditPlan[]>([]);

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getRiskAuditPlanV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData(res.data.data ?? []);
      },
    }
  );
  const height = useMemo(() => {
    return (
      rowHeight * thirdLineSize[1].h +
      commonPadding * (thirdLineSize[1].h - 1) -
      130
    );
  }, [commonPadding]);
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
        <Typography.Text>
          {t('projectManage.projectOverview.auditPlanRisk.title')}
        </Typography.Text>
      }
      subTitle={
        <Link to={`project/${projectName}/auditPlan`}>
          {t('common.showMore')}
        </Link>
      }
    >
      <Table
        {...tableCommonProps<IRiskAuditPlan>(height)}
        columns={tableColumns.auditPlan(projectName)}
        dataSource={data}
        rowKey="audit_plan_report_id"
      />
    </PanelWrapper>
  );
};

export default AuditPlanRisk;
