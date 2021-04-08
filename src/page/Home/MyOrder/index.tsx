import { useRequest } from 'ahooks';
import { Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import dashboard from '../../../api/dashboard';

const MyOrder = () => {
  const { t } = useTranslation();
  const { data: dashboardInfo } = useRequest(() => dashboard.getDashboardV1(), {
    formatResult(res) {
      return res.data?.data ?? {};
    },
  });

  return (
    <Card title={t('dashboard.title.aboutMe')}>
      <Typography.Title level={5}>
        {t('dashboard.aboutMe.myCreate')}
      </Typography.Title>
      <div>
        <Typography.Text>
          {t('dashboard.aboutMe.onProgress')}:
          {dashboardInfo?.workflow_statistics?.my_on_process_workflow_number ??
            '--'}
        </Typography.Text>
      </div>
      <div>
        <Typography.Text>
          {t('dashboard.aboutMe.reject')}:
          {dashboardInfo?.workflow_statistics?.my_rejected_workflow_number ??
            '--'}
        </Typography.Text>
      </div>
      <Typography.Title level={5}>
        {t('dashboard.aboutMe.myOperator')}
      </Typography.Title>
      <div>
        <Typography.Text>
          {t('dashboard.aboutMe.myReview')}:
          {dashboardInfo?.workflow_statistics
            ?.need_me_to_review_workflow_number ?? '--'}
        </Typography.Text>
      </div>
      <div>
        <Typography.Text>
          {t('dashboard.aboutMe.myExec')}:
          {dashboardInfo?.workflow_statistics
            ?.need_me_to_execute_workflow_number ?? '--'}
        </Typography.Text>
      </div>
    </Card>
  );
};

export default MyOrder;
