import { hexToPixel } from "./hex.js";

export class Camera {
  x;
  y;

  constructor(initX, initY) {
    this.x = initX;
    this.y = initY;
  }
}

export class Renderer {
  radius = 30;
  edge_colour = "#bdb5a6";

  context;
  width;
  height;

  camera;

  pathHex(centerX, centerY) {
    this.context.beginPath();
    for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
      let x = centerX + this.radius * Math.sin(theta);
      let y = centerY + this.radius * Math.cos(theta);
      if (theta == 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    }
    this.context.closePath();
  }

  renderHex(sx, sy, q, r, uiState) {
    this.pathHex(sx, sy);
    if (uiState.hovered && uiState.hovered.q == q && uiState.hovered.r == r) {
      this.context.fillStyle = `${this.edge_colour}88`;
      this.context.fill();
    }
    this.context.strokeStyle = this.edge_colour;
    this.context.stroke();
    if (uiState.debug) {
      this.context.fillStyle = "#000000";
      this.context.fillText(`${q}, ${r}`, sx, sy);
    }
  }

  renderGrid(uiState) {
    const xMin = -this.camera.x;
    const xMax = -this.camera.x + this.width;
    const yMin = -this.camera.y;
    const yMax = -this.camera.y + this.height;

    let rMin = Math.floor(yMin / (this.radius * 3 / 2)) - 1;
    let rMax = Math.ceil(yMax / (this.radius * 3 / 2)) + 1;
    for (let r = rMin; r <= rMax; r++) {
      let qMin = Math.floor(xMin / (this.radius * Math.sqrt(3)) - r / 2) - 1;
      let qMax = Math.ceil(xMax / (this.radius * Math.sqrt(3)) - r / 2) + 1;
      for (let q = qMin; q <= qMax; q++) {
        let { x, y } = hexToPixel(q, r, this.radius);
        let sx = x + this.camera.x;
        let sy = y + this.camera.y;
        this.renderHex(sx, sy, q, r, uiState);
      }
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  handleResize(canvas) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  constructor(radius, edge_colour, canvas) {
    this.radius = radius;
    this.edge_colour = edge_colour;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    canvas.width = this.width;
    canvas.height = this.height;

    this.context = canvas.getContext("2d");

    this.camera = new Camera((this.width / 2), (this.height / 2));
  }
}
