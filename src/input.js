import { pixelToHex } from "./hex.js";


export class InputHandler {
  camera;
  hovered;
  lastX; lastY;
  dragStartX; dragStartY;
  radius;

  onHexClick;

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

  onClick(e) {
    const worldX = e.clientX - this.camera.x;
    const worldY = e.clientY - this.camera.y;
    const { q, r } = pixelToHex(worldX, worldY, this.radius);
    this.onHexClick(q, r);
  }

  onMouseDown(e) {
    this.dragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
  }

  onMouseUp(e) {
    this.dragging = false;
    const dist = Math.hypot(e.clientX - this.dragStartX, e.clientY - this.dragStartY);
    if (dist < 5) {
      this.onClick(e);
    }
  }


  registerHandlers(canvas) {
    canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
  }

  constructor(camera, radius, onHexClick) {
    this.camera = camera;
    this.radius = radius;
    this.onHexClick = onHexClick;
  }
}
