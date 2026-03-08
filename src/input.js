import { pixelToHex } from "./hex.js";


export class InputHandler {
  camera;
  hovered;
  lastX; lastY;

  dragging = false;

  onMouseMove(e) {
    if (this.dragging) {
      this.camera.x += e.clientX - this.lastX;
      this.camera.y += e.clientY - this.lastY;
    }
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    let { q, r } = pixelToHex(e.clientX - this.camera.x, e.clientY - this.camera.y, 30);
    this.hovered = { q, r };
  }

  onMouseDown(e) {
    this.dragging = true;
  }

  onMouseUp(e) {
    this.dragging = false;
  }


  registerHandlers(canvas) {
    canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
  }

  constructor(camera) {
    this.camera = camera;
  }
}
