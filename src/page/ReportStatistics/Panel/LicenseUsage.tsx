import { RadialBarConfig } from '@ant-design/plots';
import { Result } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommonRadialBar from '../Charts/CommonRadialBar';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import statistic from '../../../api/statistic';
import { ILicenseUsageItem } from '../../../api/common';
import { floatRound } from '../../../utils/Math';
import { Datum } from '@antv/g2plot';
import { CommonChartsColors } from '../Charts';
import { AxiosResponse } from 'axios';
import { IGetLicenseUsageV1Return } from '../../../api/statistic/index.d';
import usePanelCommonRequest from './usePanelCommonRequest';

const config: RadialBarConfig = {
  data: [],
  xField: 'type',
  yField: 'percent',
  colorField: 'type',
  xAxis: false,
  yAxis: false,
};
const { thirdLineSize } = reportStatisticsData;

const LicenseUsage: React.FC = () => {
  const { t } = useTranslation();
  const [instancesUsage, setInstanceUsage] = useState<ILicenseUsageItem[]>([
    { limit: 0, used: 0, resource_type: '' },
  ]);
  const [userUsage, setUserUsage] = useState<ILicenseUsageItem>({
    limit: 0,
    used: 0,
    resource_type: '',
  });

  const isQa = useMemo(() => {
    return instancesUsage.some((v) => !v.is_limited);
  }, [instancesUsage]);

  const data: RadialBarConfig['data'] = useMemo(() => {
    const genRadialBarData = (item: ILicenseUsageItem) => {
      if (!item.is_limited || !item.limit) {
        //qa
        return {
          type: item.resource_type,
          percent: item.used ?? 0,
        };
      }
      const percent = floatRound((item.used ?? 0) / item.limit);

      return {
        type: item.resource_type,
        percent: percent > 1 ? 1 : percent,
      };
    };
    return [
      ...instancesUsage.map(genRadialBarData),
      genRadialBarData(userUsage),
    ];
  }, [instancesUsage, userUsage]);

  const maxAngle = useMemo(() => {
    if (isQa) {
      return 300;
    }
    return 360 * Math.max(...data.map((v) => v.percent));
  }, [data, isQa]);

  // https://github.com/ant-design/ant-design-charts/pull/1465
  // 但是目前这个地方的 tooltip 类型仍然没有修复..导致使用 formatter 会引发类型错误.
  const tooltip: RadialBarConfig['tooltip'] & {
    formatter?: (datum: Datum) => {
      name: string;
      value: string | number;
      title: string;
    };
  } = useMemo(() => {
    return {
      formatter: (datum: Datum) => {
        const type = datum[config.xField!];
        let item = instancesUsage.find((v) => v.resource_type === type);
        let tooltipName = t('common.alreadyUsed');
        if (!item) {
          item = userUsage;
          tooltipName = t('common.userNumber');
        }

        if (!item.is_limited || !item.limit) {
          return {
            title: item.resource_type_desc ?? '',
            name: tooltipName,
            value: item.used ?? 0,
          };
        }
        return {
          title: item.resource_type_desc ?? '',
          name: tooltipName,
          value: `${item.used} / ${item.limit}`,
        };
      },
    };
  }, [instancesUsage, t, userUsage]);

  const color: RadialBarConfig['color'] = useCallback(
    ({ type }) => {
      if (type === userUsage.resource_type) {
        return CommonChartsColors[1];
      }
      return CommonChartsColors[0];
    },
    [userUsage.resource_type]
  );

  const onSuccess = (res: AxiosResponse<IGetLicenseUsageV1Return>) => {
    setInstanceUsage(res.data.data?.instances_usage ?? []);
    setUserUsage(res.data.data?.users_usage ?? {});
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getLicenseUsageV1(),
    { onSuccess }
  );

  return (
    <PanelWrapper
      title={t('reportStatistics.licenseUsage.title')}
      loading={loading}
      error={
        errorMessage ? (
          <Result
            style={{ padding: 10 }}
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={errorMessage}
          />
        ) : null
      }
    >
      <CommonRadialBar
        {...{ ...config, data, tooltip, color, maxAngle }}
        h={thirdLineSize.h}
      />
    </PanelWrapper>
  );
};

export default LicenseUsage;
