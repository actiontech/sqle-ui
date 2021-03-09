import { random } from '../../../utils/Math';
import Dot from './common/Dot';

class LoginBackground {
  public canvas!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;

  public dots: Dot[] = [];

  public dotCount = 200;

  constructor(canvasSelector: string) {
    const canvasElement = document.querySelector(canvasSelector);
    if (!canvasElement) {
      return;
    }
    this.canvas = canvasElement as HTMLCanvasElement;
    this.canvas.height = window.innerHeight * 2;
    this.canvas.width = window.innerWidth * 2;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.draw = this.draw.bind(this);
    this.init();
    this.draw();
  }

  public init() {
    this.createDots();
  }

  public createDots() {
    for (let i = 0; i < this.dotCount; i++) {
      this.dots.push(new Dot(this.canvas, Math.random(), random(1, 3)));
    }
  }

  public draw() {
    // console.log(this.dots[0].position);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.dots.forEach((dot) => {
      dot.update();
      dot.draw();
    });

    requestAnimationFrame(this.draw);
  }
}

export default LoginBackground;
