import { MenuProps } from 'antd';
import { ReactNode } from 'react';
import { ProjectDetailUrlParamType } from '..';
import { IProjectDetailItem } from '../../../../api/common';
import { SystemRole } from '../../../../data/common';
import { t } from '../../../../locale';
import {
  ProjectDetailRouterItemKeyLiteral,
  RouterConfigItem,
} from '../../../../types/router.type';
import ProjectDetailLayout from './Layout';
import { Link } from '../../../../components/Link';
import { MenuItemGroupType } from 'antd/lib/menu/hooks/useItems';

export type ProjectDetailLayoutProps = {
  children: ReactNode;
  archive: boolean;
} & ProjectDetailUrlParamType;

export type ProjectInfoBoxProps = {
  projectInfo?: IProjectDetailItem;
};

export const generateNavigateMenu = (
  config: Array<RouterConfigItem<ProjectDetailRouterItemKeyLiteral>>,
  userRole: SystemRole | '',
  projectName: string
): MenuProps['items'] => {
  return config.reduce<MenuProps['items']>((acc, route) => {
    // eslint-disable-next-line no-lone-blocks
    {
      if (Array.isArray(route.role) && !route.role?.includes(userRole)) {
        return acc;
      }
      if (route.hideInSliderMenu) {
        return acc;
      }
      if (!!route.children && !route.hideChildrenInSliderMenu) {
        return [
          ...(acc ?? []),
          {
            key: route.key,
            icon: route.icon,
            label: route.labelWithoutI18n ?? t(route.label!),
            children: generateNavigateMenu(
              route.children,
              userRole,
              projectName
            ),
          },
        ];
      }

      if (!!route.groups) {
        return route.groups.map<MenuItemGroupType>((v) => {
          return {
            type: 'group',
            key: v.key,
            label: v.title,
            children: generateNavigateMenu(v.values, userRole, projectName),
          };
        });
      }

      return [
        ...(acc ?? []),
        {
          key: route.key,
          icon: route.icon,
          title: route.labelWithoutI18n ?? t(route.label!),
          label: (
            <Link to={`project/${projectName}/${route.path}`}>
              {route.labelWithoutI18n ?? t(route.label!)}
            </Link>
          ),
        },
      ];
    }
  }, []);
};

export default ProjectDetailLayout;
