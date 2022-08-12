import { PieConfig } from '@ant-design/plots';
import { useBoolean } from 'ahooks';
import { Result } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import { ResponseCode } from '../../../data/common';
import CommonPie from '../Charts/CommonPie';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';

const config: PieConfig = {
  data: [],
  angleField: 'count',
  colorField: 'type',
  innerRadius: 0.6,
  label: {
    type: 'inner',
    offset: '-50%',
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 14,
    },
  },
};
const { thirdLineSize } = reportStatisticsData;

const InstanceProportionWithDbType: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<PieConfig['data']>([
    {
      count: 0,
      type: '',
    },
  ]);
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getData = () => {
      startGetData();
      statistic
        .getInstancesTypePercentV1()
        .then((res) => {
          if (res.data.code !== ResponseCode.SUCCESS) {
            setErrorMessage(res.data.message ?? t('common.unknownError'));
          } else {
            setErrorMessage('');
            setData(res.data.data?.instance_type_percents ?? []);
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
      title={t('reportStatistics.orderInstanceTypeScale.title')}
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
      <CommonPie {...{ ...config, data }} h={thirdLineSize.h} />
    </PanelWrapper>
  );
};

export default InstanceProportionWithDbType;
