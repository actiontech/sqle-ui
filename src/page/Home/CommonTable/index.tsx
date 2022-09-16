import { Badge } from 'antd';
import { IWorkflowDetailResV2 } from '../../../api/common';
import { TableColumn } from '../../../types/common.type';
import CommonTable from './Table';

export const genTabPaneTitle = (title: string, badgeCount?: number) => {
  return badgeCount ? (
    <Badge
      className="tabs-panel-badge"
      count={badgeCount}
      overflowCount={99}
      size="small"
    >
      <span className="tabs-panel-title">{title}</span>
    </Badge>
  ) : (
    title
  );
};

export type CommonTableInfoType = {
  data: IWorkflowDetailResV2[];
  error: Error | undefined;
  loading: boolean;
};

export interface ICommonTableProps {
  tableInfo: CommonTableInfoType;
  customColumn?: () => TableColumn<IWorkflowDetailResV2>;
}

export const DASHBOARD_COMMON_GET_ORDER_NUMBER = 5;

export default CommonTable;
