import { G2 } from '@ant-design/plots';

/*
 * https://charts.ant.design/examples/progress-plots/gauge/#simple-indicator
 * register shape
 */

const { registerShape, Util } = G2;

export const CUSTOM_SHAPE = 'triangle-gauge-indicator';

export const registerCustomShape = () => {
  registerShape('point', CUSTOM_SHAPE, {
    draw(cfg, container) {
      const self = this as G2.Types.Shape;
      // 使用 customInfo 传递参数
      const { indicator, defaultColor } = cfg.customInfo;
      const { pointer } = indicator;
      const group = container.addGroup(); // 获取极坐标系下画布中心点

      const center = self.parsePoint({
        x: 0,
        y: 0,
      }); // 绘制指针

      if (pointer) {
        const { startAngle, endAngle } = Util.getAngle(cfg, self.coordinate);
        const radius = self.coordinate.getRadius();
        const midAngle = (startAngle + endAngle) / 2;
        const { x: x1, y: y1 } = Util.polarToCartesian(
          center.x,
          center.y,
          radius * 0.42,
          midAngle + Math.PI / 20
        );
        const { x: x2, y: y2 } = Util.polarToCartesian(
          center.x,
          center.y,
          radius * 0.42,
          midAngle - Math.PI / 20
        );
        const { x, y } = Util.polarToCartesian(
          center.x,
          center.y,
          radius * 0.6,
          midAngle
        );
        const path = [['M', x1, y1], ['L', x, y], ['L', x2, y2], ['Z']]; // pointer

        group.addShape('path', {
          name: 'pointer',
          attrs: {
            path,
            fill: defaultColor,
            ...pointer.style,
          },
        });
      }

      return group;
    },
  });
};
