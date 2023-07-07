import { Result, Space, Tooltip, Typography } from 'antd';
import PanelWrapper from './PanelWrapper';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../../components/Link';
import { Column, ColumnConfig } from '@ant-design/plots';
import { useMemo, useState } from 'react';
import { projectOverviewData } from '../index.data';
import { InfoCircleOutlined } from '@ant-design/icons';
import { DBHealthEnum, PanelCommonProps } from '.';
import usePanelCommonRequest from './usePanelCommonRequest';
import statistic from '../../../../api/statistic';
import { t } from '../../../../locale';

export const legendFormatter = (text: string) => {
  return text === DBHealthEnum.health
    ? t('projectManage.projectOverview.dataSourceCount.health')
    : t('projectManage.projectOverview.dataSourceCount.risk');
};

export const tooltipCustomContent: (
  title: string,
  data: any[]
) => React.ReactNode | string | unknown = (_, items) => {
  const value = items?.[0]?.data.value ?? 0;
  const category =
    items?.[0]?.data.category === DBHealthEnum.health
      ? t('projectManage.projectOverview.dataSourceCount.healthNum', {
          num: value,
        })
      : t('projectManage.projectOverview.dataSourceCount.riskNum', {
          num: value,
        });
  const color = items?.[0]?.color;
  const names = items?.[0]?.data.instanceNames;
  return `
  <div style="padding:12px 0;">
    <div style="margin-bottom:10px;display:flex;align-items:center;justify-content:start">
      <div style="background-color:${color};width:8px;height:8px;border-radius:50%;margin-right:12px"></div> 
      <div>${category}</div>
    </div>
    <div style="margin-left:24px">${names}</div>
  </div>`;
};

const config: ColumnConfig = {
  data: [],
  xField: 'type',
  yField: 'value',
  isStack: true,
  seriesField: 'category',
  color: ['#fbd44d', '#42a2ff'],
  minColumnWidth: 10,
  maxColumnWidth: 40,
  legend: {
    position: 'right',
    itemName: {
      formatter: legendFormatter,
    },
  },
  tooltip: {
    shared: false,
    customContent: tooltipCustomContent,
  },
};

const { rowHeight, firstLineSize } = projectOverviewData;
const DataSourceCount: React.FC<PanelCommonProps> = ({
  projectName,
  commonPadding,
  language,
  currentTheme,
}) => {
  const { t } = useTranslation();

  const height = useMemo(() => {
    return (
      rowHeight * firstLineSize[0].h +
      commonPadding * (firstLineSize[0].h - 1) -
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
    () => statistic.GetInstanceHealthV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        const dbHealths = res.data.data ?? [];

        if (dbHealths.length > 0) {
          setData(
            dbHealths.reduce<
              Array<{
                type: string;
                value: number;
                category: DBHealthEnum;
                instanceNames: string;
              }>
            >((acc, cur) => {
              const risk = {
                type: cur.db_type ?? '',
                value: cur.unhealth_instance_names?.length ?? 0,
                category: DBHealthEnum.risk,
                instanceNames: cur.unhealth_instance_names?.join('、') ?? '',
              };
              const health = {
                type: cur.db_type ?? '',
                value: cur.health_instance_names?.length ?? 0,
                category: DBHealthEnum.health,
                instanceNames: cur.health_instance_names?.join('、') ?? '',
              };

              return [...acc, risk, health];
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
            style={{ padding: 0 }}
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={errorMessage}
          />
        ) : null
      }
      title={
        <Space>
          <Typography.Text>
            {t('projectManage.projectOverview.dataSourceCount.title')}
          </Typography.Text>
          <Tooltip
            overlay={t('projectManage.projectOverview.dataSourceCount.tips')}
          >
            <InfoCircleOutlined className="text-orange" />
          </Tooltip>
        </Space>
      }
      subTitle={
        <Link to={`project/${projectName}/data`}>{t('common.showMore')}</Link>
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

export default DataSourceCount;
