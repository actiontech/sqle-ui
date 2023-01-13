import { Card, PageHeader, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

/* IFTRUE_isEE */
import { Redirect, Route, Switch } from 'react-router-dom';
import AddSyncTask from './AddSyncTask';
import SyncTaskList from './SyncTaskList';
import UpdateSyncTask from './UpdateSyncTask';
/* FITRUE_isEE */

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
          <Switch>
            <Route
              path="/syncDataSource"
              exact={true}
              component={SyncTaskList}
            />

            <Route path="/syncDataSource/create" component={AddSyncTask} />
            <Route
              path="/syncDataSource/update/:taskId"
              component={UpdateSyncTask}
            />

            <Redirect to="/syncDataSource" />
          </Switch>
        </section>
      </article>
      {/* FITRUE_isEE */}
    </>
  );
};

export default SyncDataSource;
