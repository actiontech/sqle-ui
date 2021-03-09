import { random } from '../../../../utils/Math';
import CanvasElement from './CanvasElement';
import { IPosition } from './index.type';

class Dot extends CanvasElement {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public position: IPosition = { x: 0, y: 0 };
  private size: number;
  private color: string;
  private slope!: number;
  private offset!: number;
  private speed: number;
  private randomNum: number;
  private autoMove: boolean = true;

  constructor(
    canvas: HTMLCanvasElement,
    speed?: number,
    size?: number,
    color?: string,
    slope?: number,
    offset?: number
  ) {
    super();
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.size = size ?? 3;
    this.color = color ?? '#fff';
    this.speed = speed ?? 1;
    this.randomNum = Math.random() * 5 + 5;
    this.initPosition();
    if (!slope || !offset) {
      this.randomTrajectory();
    }
  }

  public draw(): void {
    this.context.beginPath();
    this.context.fillStyle = this.color;
    this.context.arc(
      this.position.x,
      this.position.y,
      this.size,
      0,
      Math.PI * 2
    );
    this.context.fill();
    this.context.closePath();
  }

  public update(reachPosition?: IPosition): void {
    let { x, y } = this.position;
    if (!reachPosition) {
      if (!this.autoMove) {
        return;
      }
      x += this.speed;
      if (x <= 0 || x >= this.canvas.width) {
        x = 0;
      }
      y = this.slope * x + this.offset;
    } else {
      x = x + ((reachPosition.x - x) * this.randomNum) / 50;
      y = y + ((reachPosition.y - y) * this.randomNum) / 50;
    }
    this.position = { x, y };
  }

  public closeAutoMove() {
    this.autoMove = false;
  }

  public openAutoMove() {
    this.randomTrajectory();
    this.autoMove = true;
  }

  public randomTrajectory() {
    const slopeBig = random(1, this.canvas.height / 2000);
    const slopeSmall = Math.random();
    const direction = Math.random() > 0.5 ? 1 : -1;
    const slope = (Math.random() > 0.5 ? slopeBig : slopeSmall) * direction;
    const offset = this.position.y - slope * this.position.x;
    this.slope = slope;
    this.offset = offset;
  }

  public initPosition() {
    this.position = {
      x: random(1, this.canvas.width - 1),
      y: random(1, this.canvas.height - 1),
    };
  }
}

export default Dot;
