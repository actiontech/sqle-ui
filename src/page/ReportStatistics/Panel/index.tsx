import OrderAverageExecuteTime from './OrderAverageExecuteTime';
import OrderAverageReviewTime from './OrderAverageReviewTime';
import OrderPassPercent from './OrderPassPercent';
import OrderTotalNumbers from './OrderTotalNumbers';
import OrderQuantityTrend from './OrderQuantityTrend';
import OrderStatus from './OrderStatus';
import LicenseUsage from './LicenseUsage';
import OrderQuantityWithDbType from './OrderQuantityWithDbType';
import InstanceProportionWithDbType from './InstanceProportionWithDbType';
import DiffInstanceOrderRejectedPercent from './DiffInstanceOrderRejectedPercent';
import DiffUserOrderRejectedPercent from './DiffUserOrderRejectedPercent';

export {
  OrderTotalNumbers,
  OrderPassPercent,
  OrderAverageReviewTime,
  OrderAverageExecuteTime,
  OrderQuantityTrend,
  OrderStatus,
  InstanceProportionWithDbType,
  OrderQuantityWithDbType,
  LicenseUsage,
  DiffUserOrderRejectedPercent,
  DiffInstanceOrderRejectedPercent,
};

export interface PanelWrapperProps {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  loading: boolean;
  error?: React.ReactNode;
}
