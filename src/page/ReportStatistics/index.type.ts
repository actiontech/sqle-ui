import { ReportStatisticsPanelEnum } from './index.enum';

export interface IPanelGridLayout {
  i: ReportStatisticsPanelEnum;
  w: number;
  h: number;
  static: boolean;
}
