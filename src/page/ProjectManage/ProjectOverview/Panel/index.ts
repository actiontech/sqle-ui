import { CardProps } from 'antd';
import ApprovalProcess from './ApprovalProcess';
import AuditPlanClassification from './AuditPlanClassification';
import DataSourceCount from './DataSourceCount';
import MemberInfo from './MemberInfo';
import OrderClassification from './OrderClassification';
import OrderRisk from './OrderRisk';
import ProjectScore from './ProjectScore';
import SqlCount from './SqlCount';

export type PanelWrapperProps = {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  loading: boolean;
  error?: React.ReactNode;
  children?: React.ReactNode;
  bodyStyle?: CardProps['bodyStyle'];
};

export type PanelCommonProps = {
  projectName: string;
  language: string;
  currentTheme: string;
  commonPadding: number;
};

export enum DBHealthEnum {
  health = 'health',
  risk = 'risk',
}

export {
  ProjectScore,
  SqlCount,
  DataSourceCount,
  ApprovalProcess,
  AuditPlanClassification,
  MemberInfo,
  OrderClassification,
  OrderRisk,
};
