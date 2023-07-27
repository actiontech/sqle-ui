import { Result, Space, Typography } from 'antd';
import PanelWrapper from './PanelWrapper';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../../components/Link';
import { PanelCommonProps } from '.';
import { t } from '../../../../locale';
import { Pie, PieConfig } from '@ant-design/plots';
import { useMemo, useState } from 'react';
import { projectOverviewData } from '../index.data';
import usePanelCommonRequest from './usePanelCommonRequest';
import statistic from '../../../../api/statistic';
import { IWorkflowStatusCountV1 } from '../../../../api/common';

const config: PieConfig = {
  data: [],
  angleField: 'value',
  colorField: 'status',
  xAxis: false,
  yAxis: false,
  color: [
    '#42a2ff',
    '#43cb77',
    '#fbd44d',
    '#7767fa',
    '#f04864',
    '#9963e5',
    '#46cbcb',
  ],
  padding: 'auto',
  radius: 1,
  innerRadius: 0.8,
  label: false,
  statistic: {
    content: {
      formatter(_, data) {
        if (data) {
          return data.reduce((acc, cur) => acc + cur.value ?? 0, 0).toString();
        }
        return '0';
      },
    },
  },
};

const orderStatusMap = () => {
  return new Map<keyof IWorkflowStatusCountV1, string>([
    [
      'execution_success_count',
      t('projectManage.projectOverview.orderClassification.executionSuccess'),
    ],
    [
      'waiting_for_audit_count',
      t('projectManage.projectOverview.orderClassification.waitingForAudit'),
    ],
    [
      'closed_count',
      t('projectManage.projectOverview.orderClassification.closed'),
    ],

    [
      'rejected_count',
      t('projectManage.projectOverview.orderClassification.rejected'),
    ],

    [
      'waiting_for_execution_count',
      t(
        'projectManage.projectOverview.orderClassification.waitingForExecution'
      ),
    ],
    [
      'executing_failed_count',
      t('projectManage.projectOverview.orderClassification.executionFailed'),
    ],
    [
      'executing_count',
      t('projectManage.projectOverview.orderClassification.executing'),
    ],
  ]);
};

const { rowHeight, secondLineSize } = projectOverviewData;
const OrderClassification: React.FC<PanelCommonProps> = ({
  projectName,
  currentTheme,
  commonPadding,
  language,
}) => {
  const { t } = useTranslation();

  const height = useMemo(() => {
    return (
      rowHeight * secondLineSize[0].h +
      commonPadding * (secondLineSize[0].h - 1) -
      80
    );
  }, [commonPadding]);

  const [data, setData] = useState<PieConfig['data']>([
    { status: '', value: 0 },
  ]);
  const formatData = (
    originData?: IWorkflowStatusCountV1
  ): PieConfig['data'] => {
    if (!originData) {
      return [];
    }

    return Object.keys(originData).map((key) => {
      return {
        value: originData[key as keyof IWorkflowStatusCountV1],
        status: orderStatusMap().get(key as keyof IWorkflowStatusCountV1),
      };
    });
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.statisticWorkflowStatusV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData(
          formatData({
            waiting_for_audit_count:
              res.data.data?.waiting_for_audit_count ?? 0,
            waiting_for_execution_count:
              res.data.data?.waiting_for_execution_count ?? 0,
            execution_success_count:
              res.data.data?.execution_success_count ?? 0,
            executing_count: res.data.data?.executing_count ?? 0,
            executing_failed_count: res.data.data?.executing_failed_count ?? 0,
            rejected_count: res.data.data?.rejected_count ?? 0,
            closed_count: res.data.data?.closed_count ?? 0,
          })
        );
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
            {t('projectManage.projectOverview.orderClassification.title')}
          </Typography.Text>
          <Link
            to={`project/${projectName}/order/create`}
            className="font-size-small"
          >
            {t('order.createOrder.button')}
          </Link>
        </Space>
      }
    >
      <Pie
        {...{ ...config, data }}
        theme={currentTheme}
        locale={language}
        height={height}
      />
    </PanelWrapper>
  );
};

export default OrderClassification;
