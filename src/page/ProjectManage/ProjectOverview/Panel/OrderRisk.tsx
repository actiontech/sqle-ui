import { Result, Table, Typography } from 'antd';
import PanelWrapper from './PanelWrapper';
import { useTranslation } from 'react-i18next';
import { projectOverviewData } from '../index.data';
import { PanelCommonProps } from '.';
import { Link } from '../../../../components/Link';
import usePanelCommonRequest from './usePanelCommonRequest';
import statistic from '../../../../api/statistic';
import { useMemo, useState } from 'react';
import { IRiskWorkflow } from '../../../../api/common';

const { tableColumns, tableCommonProps, rowHeight, secondLineSize } =
  projectOverviewData;
const OrderRisk: React.FC<
  Pick<PanelCommonProps, 'projectName' | 'commonPadding'>
> = ({ projectName, commonPadding }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<IRiskWorkflow[]>();
  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.statisticRiskWorkflowV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData(res.data.data);
      },
    }
  );
  const height = useMemo(() => {
    return (
      rowHeight * secondLineSize[1].h +
      commonPadding * (secondLineSize[1].h - 1) -
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
          {t('projectManage.projectOverview.orderRisk.title')}
        </Typography.Text>
      }
      subTitle={
        <Link to={`project/${projectName}/order`}>{t('common.showMore')}</Link>
      }
    >
      <Table
        {...tableCommonProps<IRiskWorkflow>(height)}
        columns={tableColumns.order(projectName)}
        dataSource={data}
        rowKey="workflow_id"
      />
    </PanelWrapper>
  );
};

export default OrderRisk;
