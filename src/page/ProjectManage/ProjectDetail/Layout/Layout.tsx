import { Layout, Menu, MenuTheme, Space, Typography } from 'antd';
import { SiderTheme } from 'antd/lib/layout/Sider';
import { cloneDeep, groupBy } from 'lodash';
import { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { generateNavigateMenu, ProjectDetailLayoutProps } from '.';
import EmptyBox from '../../../../components/EmptyBox';
import { SQLE_BASE_URL, SystemRole } from '../../../../data/common';
import useAuditPlanTypes from '../../../../hooks/useAuditPlanTypes';
import useChangeTheme from '../../../../hooks/useChangeTheme';
import { projectDetailRouterConfig } from '../../../../router/config';
import { IReduxState } from '../../../../store';
import useStyles from '../../../../theme';
import {
  ProjectDetailRouterItemKeyLiteral,
  RouterConfigItem,
} from '../../../../types/router.type';

import './index.less';

const AuditPlan = lazy(
  () => import(/* webpackChunkName: "AuditPlan" */ '../../../AuditPlan')
);

const ALL_INSTANCE_TYPE = '';

const ProjectDetailLayout: React.FC<ProjectDetailLayoutProps> = ({
  children,
  projectName,
  archive,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const userRole = useSelector<IReduxState, SystemRole | ''>(
    (state) => state.user.role
  );
  const { currentTheme } = useChangeTheme();
  const location = useLocation();
  const { updateAuditPlanTypes, auditPlanTypes } = useAuditPlanTypes();
  const [innerRouterConfig, setInnerRouterConfig] = useState(
    projectDetailRouterConfig
  );

  const selectMenu = useCallback(
    (config: RouterConfigItem<string>[], pathname: string): string[] => {
      for (const route of config) {
        const realPath = `${SQLE_BASE_URL}project/${projectName}/${route.path}`;
        if (realPath === pathname && route.hideInSliderMenu !== true) {
          if (pathname === `${SQLE_BASE_URL}project/${projectName}/auditPlan`) {
            const params = new URLSearchParams(location.search);
            if (params.has('type')) {
              return [`auditPlan${params.get('type')}`];
            }
          }
          return [route.key];
        }
        if (!!route.children) {
          const key = selectMenu(route.children, pathname);
          if (key.length > 0) {
            return key;
          }
        }
      }
      return [];
    },
    [location.search, projectName]
  );

  const selectMenuWrapper = useCallback((): string[] => {
    let pathname = location.pathname;
    let selectKey: string[] = [];
    while (pathname.length > 0) {
      selectKey = selectMenu(innerRouterConfig, pathname);
      if (selectKey.length !== 0) {
        return selectKey;
      } else {
        const temp = pathname.split('/');
        temp.pop();
        pathname = temp.join('/');
      }
    }
    return selectKey;
  }, [innerRouterConfig, location.pathname, selectMenu]);

  const menuItems = useMemo(
    () => generateNavigateMenu(innerRouterConfig, userRole, projectName),
    [innerRouterConfig, userRole, projectName]
  );

  useEffect(() => {
    updateAuditPlanTypes();
  }, [updateAuditPlanTypes]);

  useEffect(() => {
    if (auditPlanTypes.length > 0) {
      const newRouterConfig = cloneDeep(projectDetailRouterConfig);
      const plan = newRouterConfig
        .find((item) => item.key === 'plane')
        ?.children?.find((item) => item.key === 'auditPlan');
      if (!plan) {
        return;
      }

      const auditPlanTypesDictionary = groupBy(auditPlanTypes, 'instance_type');

      //add default data
      if (auditPlanTypesDictionary[ALL_INSTANCE_TYPE] === undefined) {
        auditPlanTypesDictionary[ALL_INSTANCE_TYPE] = [];
      }
      auditPlanTypesDictionary[ALL_INSTANCE_TYPE].unshift({
        type: '',
        desc: t('menu.auditPlaneList'),
      });

      plan.groups = Object.keys(auditPlanTypesDictionary).map((key) => {
        const value =
          auditPlanTypesDictionary[
            key as keyof typeof auditPlanTypesDictionary
          ];
        return {
          title: key === ALL_INSTANCE_TYPE ? t('menu.allInstanceType') : key,
          values: value.map((e) => ({
            path: `auditPlan?type=${e.type}`,
            key: `auditPlan${e.type}` as ProjectDetailRouterItemKeyLiteral,
            label: 'menu.auditPlane',
            labelWithoutI18n: e.desc,
            element: <AuditPlan />,
          })),
        };
      });
      setInnerRouterConfig(newRouterConfig);
    }
  }, [auditPlanTypes, t]);

  return (
    <Layout className="project-detail-wrapper">
      <Layout.Sider
        theme={currentTheme as SiderTheme}
        className={`${styles.projectLayoutSider}`}
      >
        <EmptyBox
          if={archive}
          defaultNode={
            <Typography.Title
              ellipsis={true}
              style={{ padding: 20, paddingRight: 0 }}
            >
              {projectName}
            </Typography.Title>
          }
        >
          <Space size={0}>
            <Typography.Title
              ellipsis={true}
              style={{ padding: 20, paddingRight: 0, maxWidth: 140 }}
            >
              {projectName}
            </Typography.Title>
            <Typography.Text type={'danger'}>
              {`(${t('projectManage.projectList.column.unavailable')})`}
            </Typography.Text>
          </Space>
        </EmptyBox>

        <Menu
          selectedKeys={selectMenuWrapper()}
          mode="inline"
          theme={currentTheme as MenuTheme}
          items={menuItems}
        />
      </Layout.Sider>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
};

export default ProjectDetailLayout;
