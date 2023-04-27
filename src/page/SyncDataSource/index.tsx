import { Card, PageHeader, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

const SyncDataSource: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* IFTRUE_isCE */}
      <section className="padding-content">
        <Card>
          {t('syncDataSource.ceTips')}
          <Typography.Paragraph>
            <ul>
              <li>
                <a href="https://actiontech.github.io/sqle-docs-cn/">
                  https://actiontech.github.io/sqle-docs-cn/
                </a>
              </li>
              <li>
                <a href="https://www.actionsky.com/">
                  https://www.actionsky.com/
                </a>
              </li>
            </ul>
          </Typography.Paragraph>
        </Card>
      </section>
      {/* FITRUE_isCE */}

      {/* IFTRUE_isEE */}
      <article>
        <PageHeader title={t('syncDataSource.pageTitle')} ghost={false}>
          {t('syncDataSource.pageDesc')}
        </PageHeader>
        <section className="padding-content">
          <Outlet />
        </section>
      </article>
      {/* FITRUE_isEE */}
    </>
  );
};

export default SyncDataSource;
