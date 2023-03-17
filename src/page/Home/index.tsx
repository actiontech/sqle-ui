import { useRequest } from 'ahooks';
import { Badge, Divider, PageHeader, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import dashboard from '../../api/dashboard';
import DBAPanel from './DBAPanel';
import DEVPanel from './DEVPanel';
import RecentlyOrderPanel from './RecentlyOrderPanel';
import { useState } from 'react';
import './index.less';

export const ALL_PROJECT_NAME = '';

const Home = () => {
  const { t } = useTranslation();

  const [filterProjectName, setFilterProjectName] = useState(ALL_PROJECT_NAME);

  const { data: workflowStatistics, refresh: getWorkflowStatistics } =
    useRequest(
      () =>
        dashboard.getDashboardV1({
          filter_project_name: filterProjectName,
        }),
      {
        formatResult(res) {
          return res.data?.data?.workflow_statistics;
        },
        refreshDeps: [filterProjectName],
      }
    );

  /* IFTRUE_isEE */
  const { data: projectTipSelectOptions } = useRequest(
    () => dashboard.getDashboardProjectTipsV1(),
    {
      formatResult(res) {
        const genLabel = (name?: string, count?: number) => {
          return (
            <Space className="full-width-element flex-space-between">
              {name}
              {<Badge size="small" count={count} showZero={true} />}
            </Space>
          );
        };
        const sumCount = res.data.data?.reduce(
          (acc, cur) => acc + (cur?.unfinished_workflow_count ?? 0),
          0
        );
        return [
          {
            label: genLabel(t('dashboard.allProjectTip'), sumCount),
            value: ALL_PROJECT_NAME,
            showLabel: t('dashboard.allProjectTip'),
          },
          ...(res.data.data
            ?.sort(
              (a, b) =>
                (b?.unfinished_workflow_count ?? 0) -
                (a?.unfinished_workflow_count ?? 0)
            )
            .map((v) => {
              return {
                label: genLabel(
                  v.project_name,
                  v.unfinished_workflow_count ?? 0
                ),
                value: v?.project_name ?? '',
                showLabel: v?.project_name ?? '',
              };
            }) ?? []),
        ];
      },
    }
  );
  /* FITRUE_isEE */

  return (
    <>
      {/* IFTRUE_isCE */}
      <PageHeader title={t('dashboard.pageTitle')} ghost={false} />
      {/* FITRUE_isCE */}

      {/* IFTRUE_isEE */}
      <PageHeader
        title={
          <Space>
            <>
              {t('dashboard.pageTitle')}
              <Select
                data-testid="filter-project-name"
                dropdownMatchSelectWidth={false}
                value={filterProjectName}
                style={{ width: 160 }}
                options={projectTipSelectOptions}
                optionLabelProp="showLabel"
                defaultValue={ALL_PROJECT_NAME}
                onChange={setFilterProjectName}
                dropdownRender={(menu) => {
                  return (
                    <>
                      <Space
                        className="full-width-element flex-space-between"
                        style={{ paddingLeft: 12, paddingRight: 12 }}
                      >
                        {t('dashboard.projectName')}
                      </Space>

                      <Divider style={{ margin: 4 }} />
                      {menu}
                    </>
                  );
                }}
              />
            </>
          </Space>
        }
        ghost={false}
      >
        {t('dashboard.pageDesc')}
      </PageHeader>
      {/* FITRUE_isEE */}

      <section className="padding-content sqle-home-content">
        <Space direction="vertical" className="full-width-element" size="large">
          <DBAPanel
            workflowStatistics={workflowStatistics}
            getWorkflowStatistics={getWorkflowStatistics}
            projectName={filterProjectName}
          />
          <DEVPanel
            workflowStatistics={workflowStatistics}
            getWorkflowStatistics={getWorkflowStatistics}
            projectName={filterProjectName}
          />
          <RecentlyOrderPanel projectName={filterProjectName} />
        </Space>
      </section>
    </>
  );
};

export default Home;
