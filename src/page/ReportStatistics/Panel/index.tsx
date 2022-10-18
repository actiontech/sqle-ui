import OrderAverageReviewTime from './OrderAverageReviewTime';
import OrderPassPercent from './OrderPassPercent';
import OrderTotalNumbers from './OrderTotalNumbers';
import OrderQuantityTrend from './OrderQuantityTrend';
import OrderStatus from './OrderStatus';
import LicenseUsage from './LicenseUsage';
import OrderQuantityWithDbType from './OrderQuantityWithDbType';
import InstanceProportionWithDbType from './InstanceProportionWithDbType';
import DiffUserOrderRejectedPercent from './DiffUserOrderRejectedPercent';
import SqlExecFailedTopN from './SqlExecFailedTopN';
import OrderAverageExecuteTimeTopN from './OrderAverageExecuteTimeTopN';

export {
  OrderTotalNumbers,
  OrderPassPercent,
  OrderAverageReviewTime,
  OrderQuantityTrend,
  OrderStatus,
  InstanceProportionWithDbType,
  OrderQuantityWithDbType,
  LicenseUsage,
  DiffUserOrderRejectedPercent,
  SqlExecFailedTopN,
  OrderAverageExecuteTimeTopN,
};

export interface PanelWrapperProps {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  loading: boolean;
  error?: React.ReactNode;
}
