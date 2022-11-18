import { Menu } from 'antd';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ProjectDetailUrlParamType } from '..';
import { IProjectDetailItem } from '../../../../api/common';
import { SystemRole } from '../../../../data/common';
import i18n from '../../../../locale';
import {
  ProjectDetailRouterItemKeyLiteral,
  RouterItem,
} from '../../../../types/router.type';
import ProjectDetailLayout from './Layout';

export type ProjectDetailLayoutProps = {
  children: ReactNode;
} & ProjectDetailUrlParamType &
  ProjectInfoBoxProps;

export type ProjectInfoBoxProps = {
  projectInfo?: IProjectDetailItem;
};

export const generateNavigateMenu = (
  config: Array<
    RouterItem<ProjectDetailRouterItemKeyLiteral> & { search?: string }
  >,
  userRole: SystemRole | '',
  projectName: string
) => {
  return config.map((route) => {
    if (Array.isArray(route.role) && !route.role?.includes(userRole)) {
      return null;
    }
    if (route.hideInSliderMenu) {
      return null;
    }
    if (!!route.components) {
      return (
        <Menu.SubMenu
          key={route.key}
          icon={route.icon}
          title={route.labelWithoutI18n ?? i18n.t(route.label)}
        >
          {generateNavigateMenu(route.components, userRole, projectName)}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item key={route.key} icon={route.icon}>
        <Link to={(route.path as string).replace(':projectName', projectName)}>
          {route.labelWithoutI18n ?? i18n.t(route.label)}
        </Link>
      </Menu.Item>
    );
  });
};

export default ProjectDetailLayout;
