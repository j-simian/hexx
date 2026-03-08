import { pixelToHex } from "./hex.js";


export class InputHandler {
  camera;
  hovered;
  lastX; lastY;
  dragStartX; dragStartY;
  radius;

  onHexClick;

  dragging = false;

  getXY(e) {
    if (e.changedTouches) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  onMove(e) {
    const { x, y } = this.getXY(e);
    if (this.dragging) {
      this.camera.x += x - this.lastX;
      this.camera.y += y - this.lastY;
    }
    this.lastX = x;
    this.lastY = y;
    let { q, r } = pixelToHex(x - this.camera.x, y - this.camera.y, this.radius);
    this.hovered = { q, r };
  }

  onClick(e) {
    const { x, y } = this.getXY(e);
    const worldX = x - this.camera.x;
    const worldY = y - this.camera.y;
    const { q, r } = pixelToHex(worldX, worldY, this.radius);
    this.onHexClick(q, r);
  }

  onDown(e) {
    const { x, y } = this.getXY(e);
    this.dragging = true;
    this.dragStartX = x;
    this.dragStartY = y;
  }

  onUp(e) {
    const { x, y } = this.getXY(e);
    this.dragging = false;
    const dist = Math.hypot(x - this.dragStartX, y - this.dragStartY);
    if (dist < 5) {
      this.onClick(e);
    }
  }

  registerHandlers(canvas) {
    canvas.addEventListener("mousemove", (e) => this.onMove(e));
    canvas.addEventListener("mousedown", (e) => this.onDown(e));
    canvas.addEventListener("mouseup", (e) => this.onUp(e));
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); this.onDown(e); }, { passive: false });
    canvas.addEventListener("touchmove", (e) => { e.preventDefault(); this.onMove(e); }, { passive: false });
    canvas.addEventListener("touchend", (e) => { e.preventDefault(); this.onUp(e); }, { passive: false });
  }

  constructor(camera, radius, onHexClick) {
    this.camera = camera;
    this.radius = radius;
    this.onHexClick = onHexClick;
  }
}
