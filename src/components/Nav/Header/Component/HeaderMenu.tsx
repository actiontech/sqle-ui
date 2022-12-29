import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { DEFAULT_PROJECT_NAME } from '../../../../page/ProjectManage/ProjectDetail';
import { globalRouterConfig } from '../../../../router/config';
import {
  GlobalRouterItemKeyLiteral,
  RouterItem,
} from '../../../../types/router.type';
import ProjectNavigation from './ProjectNavigation';

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
  const history = useHistory();

  const jumpToPath = (path: string) => {
    /* IFTRUE_isCE */
    if (path.includes(':projectName')) {
      path = path.replace(':projectName', DEFAULT_PROJECT_NAME);
    }
    /* FITRUE_isCE */

    history.push(path);
  };

  const [projectNavigationVisible, setProjectNavigationVisible] =
    useState(false);

  const isActiveMenu = useCallback(
    (router: RouterItem<GlobalRouterItemKeyLiteral>) => {
      if (router.key === 'projectList' || router.key === 'projectDetail') {
        return /^\/project.*/.test(location.pathname);
      }

      return router.path === location.pathname;
    },
    [location.pathname]
  );

  const generateMenu = (router: RouterItem<GlobalRouterItemKeyLiteral>) => {
    if (router.key === 'projectList') {
      return (
        <ProjectNavigation
          key="projectList"
          visible={projectNavigationVisible}
          onVisibleChange={setProjectNavigationVisible}
        >
          <div
            className={`${
              isActiveMenu(router) ? 'header-menu-item-active' : ''
            } header-menu-item`}
            onClick={() => setProjectNavigationVisible(true)}
          >
            <span className="header-menu-item-icon">{router.icon}</span>
            {t(router.label)}
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
        onClick={() => jumpToPath(router.path as string)}
      >
        <span className="header-menu-item-icon">{router.icon}</span>
        {t(router.label)}
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
