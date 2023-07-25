import { IDriverMeta } from '../../api/common';

/*
 * 禁止修改该数据现有的顺序, 否则会造成单元测试中模拟 选择数据源类型下拉数据出现异常.
 * 可以在数组尾部新增数据
 */
export const driverMeta: IDriverMeta[] = [
  {
    default_port: 4443,
    driver_name: 'oracle',
  },
  {
    default_port: 3306,
    driver_name: 'mysql',
  },
];
