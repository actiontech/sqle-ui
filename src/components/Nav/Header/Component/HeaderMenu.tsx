import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import useNavigate from '../../../../hooks/useNavigate';
import { DEFAULT_PROJECT_NAME } from '../../../../page/ProjectManage/ProjectDetail';
import { globalRouterConfig } from '../../../../router/config';
import {
  GlobalRouterItemKeyLiteral,
  ProjectDetailRouterItemKeyLiteral,
  RouterConfigItem,
} from '../../../../types/router.type';
import ProjectNavigation from './ProjectNavigation';
import { SQLE_BASE_URL } from '../../../../data/common';

const headerMenuKeys: Array<typeof globalRouterConfig[number]['key']> = [
  'dashboard',
  'rule',
  'sqlQuery',
  /* IFTRUE_isEE */
  'projectList',
  /* FITRUE_isEE */
  /* IFTRUE_isCE */
  'projectDetail',
  /* FITRUE_isCE */
];

const HeaderMenu: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const jumpToPath = (
    path: string,
    key: GlobalRouterItemKeyLiteral | ProjectDetailRouterItemKeyLiteral
  ) => {
    /* IFTRUE_isCE */
    if (key === 'projectDetail') {
      path = `project/${DEFAULT_PROJECT_NAME}/overview`;
    }
    /* FITRUE_isCE */

    navigate(path);
  };

  const [projectNavigationVisible, setProjectNavigationVisible] =
    useState(false);

  const isActiveMenu = useCallback(
    (
      router: RouterConfigItem<
        GlobalRouterItemKeyLiteral | ProjectDetailRouterItemKeyLiteral
      >
    ) => {
      if (router.key === 'projectList' || router.key === 'projectDetail') {
        return location.pathname.startsWith(`${SQLE_BASE_URL}project`);
      }

      return SQLE_BASE_URL + router.path === location.pathname;
    },
    [location.pathname]
  );

  const generateMenu = (
    router: RouterConfigItem<
      GlobalRouterItemKeyLiteral | ProjectDetailRouterItemKeyLiteral
    >
  ) => {
    if (router.key === 'projectList') {
      return (
        <ProjectNavigation
          key="projectList"
          open={projectNavigationVisible}
          onOpenChange={setProjectNavigationVisible}
        >
          <div
            className={`${
              isActiveMenu(router) ? 'header-menu-item-active' : ''
            } header-menu-item`}
            onClick={() => setProjectNavigationVisible(true)}
          >
            <>
              <span className="header-menu-item-icon">{router.icon}</span>
              {router.label ? t(router.label) : ''}
            </>
          </div>
        </ProjectNavigation>
      );
    }

    return (
      <div
        key={router.key}
        className={`${
          isActiveMenu(router) ? 'header-menu-item-active' : ''
        } header-menu-item`}
        onClick={() => jumpToPath(router.path as string, router.key)}
      >
        <>
          <span className="header-menu-item-icon">{router.icon}</span>
          {router.label ? t(router.label) : ''}
        </>
      </div>
    );
  };

  return (
    <div className="header-menu">
      {globalRouterConfig.map((router) => {
        if (headerMenuKeys.includes(router.key)) {
          return generateMenu(router);
        }
        return null;
      })}
    </div>
  );
};

export default HeaderMenu;
