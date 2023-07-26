import { Result, Space, Typography } from 'antd';
import PanelWrapper from './PanelWrapper';
import { useTranslation } from 'react-i18next';
import { Column, ColumnConfig } from '@ant-design/plots';
import { useMemo, useState } from 'react';
import { projectOverviewData } from '../index.data';
import { t } from '../../../../locale';
import { Link } from '../../../../components/Link';
import { PanelCommonProps } from '.';
import usePanelCommonRequest from './usePanelCommonRequest';
import statistic from '../../../../api/statistic';

const config: ColumnConfig = {
  data: [],
  xField: 'type',
  yField: 'value',
  meta: {
    value: {
      alias: t('projectManage.projectOverview.memberInfo.count'),
    },
  },
  minColumnWidth: 10,
  maxColumnWidth: 40,
  color: '#42a2ff',
  yAxis: {
    //纵轴刻度值间隔值
    tickInterval: 1,
  },
};
const { rowHeight, fourthLineSize } = projectOverviewData;

const MemberInfo: React.FC<PanelCommonProps> = ({
  projectName,
  language,
  currentTheme,
  commonPadding,
}) => {
  const { t } = useTranslation();
  const height = useMemo(() => {
    return (
      rowHeight * fourthLineSize[0].h +
      commonPadding * (fourthLineSize[0].h - 1) -
      80
    );
  }, [commonPadding]);
  const [data, setData] = useState<ColumnConfig['data']>([
    { type: 'dev', value: 0 },
    { type: 'dba', value: 0 },
  ]);

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getRoleUserCountV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        if (res.data.data?.length) {
          setData(
            (res.data.data ?? []).map((v) => ({
              type: v.role ?? '',
              value: v.count ?? 0,
            }))
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
        <Space size={12}>
          <Typography.Text>
            {t('projectManage.projectOverview.memberInfo.title')}
          </Typography.Text>
          <Link
            to={`project/${projectName}/member`}
            className="font-size-small"
          >
            {t('projectManage.projectOverview.memberInfo.action')}
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

export default MemberInfo;
