import { Layout, Menu } from 'antd';
import { cloneDeep } from 'lodash';
import { lazy, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { generateNavigateMenu, ProjectDetailLayoutProps } from '.';
import { SystemRole } from '../../../../data/common';
import useAuditPlanTypes from '../../../../hooks/useAuditPlanTypes';
import { projectDetailRouterConfig } from '../../../../router/config';
import { IReduxState } from '../../../../store';
import {
  ProjectDetailRouterItemKeyLiteral,
  RouterItem,
} from '../../../../types/router.type';

import './index.less';
import ProjectInfoBox from './ProjectInfoBox';

const AuditPlan = lazy(
  () => import(/* webpackChunkName: "AuditPlan" */ '../../../AuditPlan')
);

const ProjectDetailLayout: React.FC<ProjectDetailLayoutProps> = ({
  children,
  projectName,
}) => {
  const userRole = useSelector<IReduxState, SystemRole | ''>(
    (state) => state.user.role
  );
  const location = useLocation();
  const { updateAuditPlanTypes, auditPlanTypes } = useAuditPlanTypes();
  const [innerRouterConfig, setInnerRouterConfig] = useState(
    projectDetailRouterConfig
  );

  const selectMenu = useCallback(
    (config: RouterItem<string>[], pathname: string): string[] => {
      for (const route of config) {
        if (route.path === pathname && route.hideInSliderMenu !== true) {
          if (pathname === '/auditPlan') {
            const params = new URLSearchParams(location.search);
            if (params.has('type')) {
              return [`auditPlan${params.get('type')}`];
            }
          }
          return [route.key];
        }
        if (!!route.components) {
          const key = selectMenu(route.components, pathname);
          if (key.length > 0) {
            return key;
          }
        }
      }
      return [];
    },
    [location.search]
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

  useEffect(() => {
    updateAuditPlanTypes();
  }, [updateAuditPlanTypes]);

  useEffect(() => {
    if (auditPlanTypes.length > 0) {
      const newRouterConfig = cloneDeep(projectDetailRouterConfig);
      const plan = newRouterConfig.find((item) => item.key === 'plane');
      if (!plan) {
        return;
      }
      const newRouters = auditPlanTypes.map<
        RouterItem<ProjectDetailRouterItemKeyLiteral> & { search?: string }
      >((e) => ({
        path: `/project/:projectName/auditPlan?type=${e.type}`,
        key: `auditPlan${e.type}` as ProjectDetailRouterItemKeyLiteral,
        label: 'menu',
        labelWithoutI18n: e.desc,
        component: AuditPlan,
      }));
      plan.components = [...plan.components!, ...newRouters];
      setInnerRouterConfig(newRouterConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditPlanTypes]);

  return (
    <Layout className="project-detail-wrapper">
      <Layout.Sider>
        <ProjectInfoBox />
        <Menu
          selectedKeys={selectMenuWrapper()}
          defaultOpenKeys={['order']}
          mode="inline"
          theme="dark"
        >
          {generateNavigateMenu(innerRouterConfig, userRole, projectName)}
        </Menu>
      </Layout.Sider>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
};

export default ProjectDetailLayout;
