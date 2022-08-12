import { RadialBarConfig } from '@ant-design/plots';
import { useBoolean } from 'ahooks';
import { Result } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommonRadialBar from '../Charts/CommonRadialBar';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import statistic from '../../../api/statistic';
import { ILicenseUsageItem } from '../../../api/common';
import { ResponseCode } from '../../../data/common';
import { floatRound } from '../../../utils/Math';
import { Datum } from '@antv/g2plot';
import { CommonChartsColors } from '../Charts';

const config: RadialBarConfig = {
  data: [],
  xField: 'type',
  yField: 'percent',
  colorField: 'type',
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

  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);
  const [errorMessage, setErrorMessage] = useState('');

  const data: RadialBarConfig['data'] = useMemo(() => {
    const genRadialBarData = (item: ILicenseUsageItem) => {
      if (!item.is_limited || !item.limit) {
        //qa
        return {
          type: item.resource_type,
          percent: item.used ?? 0,
        };
      }
      return {
        type: item.resource_type,
        percent: !item.used ? 0 : floatRound(item.used / item.limit),
      };
    };
    return [
      ...instancesUsage.map((v) => genRadialBarData(v)),
      genRadialBarData(userUsage),
    ];
  }, [instancesUsage, userUsage]);
  // 为什么要添加 any
  // https://github.com/ant-design/ant-design-charts/pull/1465
  // 但是目前这个地方的 tooltip 类型仍然没有修复..导致使用 formatter 会引发类型错误.
  const tooltip: RadialBarConfig['tooltip'] & any = useMemo(() => {
    return {
      formatter: (datum: Datum) => {
        const type = datum[config.xField!];
        const item =
          instancesUsage.find((v) => v.resource_type === type) ?? userUsage;
        if (!item.is_limited || !item.limit) {
          return {
            name: t('common.alreadyUsed'),
            value: item.used,
          };
        }
        return {
          name: t('common.alreadyUsed'),
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

  useEffect(() => {
    const getData = () => {
      startGetData();
      statistic
        .getLicenseUsageV1()
        .then((res) => {
          if (res.data.code !== ResponseCode.SUCCESS) {
            setErrorMessage(res.data.message ?? t('common.unknownError'));
          } else {
            setErrorMessage('');
            setInstanceUsage(res.data.data?.instances_usage ?? []);
            setUserUsage(res.data.data?.users_usage ?? {});
          }
        })
        .catch((error) => {
          setErrorMessage(error?.toString() ?? t('common.unknownError'));
        })
        .finally(() => {
          finishGetData();
        });
    };

    getData();
  }, [finishGetData, startGetData, t]);
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
        {...{ ...config, data, tooltip, color }}
        h={thirdLineSize.h}
      />
    </PanelWrapper>
  );
};

export default LicenseUsage;
