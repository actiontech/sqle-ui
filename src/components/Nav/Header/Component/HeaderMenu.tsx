import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { globalRouterConfig } from '../../../../router/config';

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
    history.push(path);
  };
  return (
    <div className="header-menu">
      {globalRouterConfig.map((router) => {
        if (headerMenuKeys.includes(router.key)) {
          return (
            <div
              key={router.key}
              className={`${
                location.pathname === router.path
                  ? 'header-menu-item-active'
                  : ''
              } header-menu-item`}
              onClick={() => jumpToPath(router.path as string)}
            >
              <span className="header-menu-item-icon">{router.icon}</span>
              {t(router.label)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default HeaderMenu;
