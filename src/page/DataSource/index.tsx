import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Redirect, Route } from 'react-router';
import { Switch } from 'react-router-dom';
import AddDataSource from './AddDataSource';
import DataSourceList from './DataSourceList';
import UpdateDataSource from './UpdateDataSource';

const DataSource = () => {
  const { t } = useTranslation();

  return (
    <article className="data-source-page-namespace">
      <PageHeader title={t('dataSource.pageTitle')} ghost={false}>
        {t('dataSource.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Switch>
          <Route path="/data" exact={true} component={DataSourceList} />
          <Route path="/data/create" component={AddDataSource} />
          <Route
            path="/data/update/:instanceName"
            component={UpdateDataSource}
          />
          <Redirect to="/data" />
        </Switch>
      </section>
    </article>
  );
};

export default DataSource;
