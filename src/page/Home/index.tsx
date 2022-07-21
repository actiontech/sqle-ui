import { useRequest } from 'ahooks';
import { PageHeader, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import dashboard from '../../api/dashboard';
import DBAPanel from './DBAPanel';
import QuickLink from './QuickLink';
import DEVPanel from './DEVPanel';
import RecentlyOrderPanel from './RecentlyOrderPanel';

import './index.less';

const Home = () => {
  const { t } = useTranslation();

  const { data: workflowStatistics } = useRequest(
    () => dashboard.getDashboardV1(),
    {
      formatResult(res) {
        return res.data?.data?.workflow_statistics;
      },
    }
  );

  return (
    <>
      <PageHeader title={t('dashboard.pageTitle')} ghost={false} />
      <section className="padding-content sqle-home-content">
        <Space direction="vertical" className="full-width-element" size="large">
          <DBAPanel workflowStatistics={workflowStatistics} />
          <DEVPanel workflowStatistics={workflowStatistics} />
          <RecentlyOrderPanel />
        </Space>
      </section>
      <QuickLink />
    </>
  );
};

export default Home;
