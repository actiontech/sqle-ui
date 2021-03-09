import { IPosition } from './index.type';

abstract class CanvasElement {
  abstract position: IPosition;
  abstract canvas: HTMLCanvasElement;
  abstract context: CanvasRenderingContext2D;
  abstract draw(): void;
  abstract update(reachPosition: IPosition): void;
}

export default CanvasElement;
