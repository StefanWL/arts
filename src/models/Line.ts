import { ColorRepresentation, Vector2, Vector3 } from "three";
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';


export class Line {
  drawCount: number;
  color: ColorRepresentation;

  line: Line2;
  geometry: LineGeometry;
  points: Float32Array;

  constructor(color: ColorRepresentation, x: number, y: number, maxLength: number) {
    this.drawCount = 0;
    this.color = color;

    this.points = new Float32Array(maxLength * 3);
    this.geometry = new LineGeometry();
    this.geometry.setPositions(this.points);

    const material = new LineMaterial({
      color: color as number,
      linewidth: 5,
      resolution: new Vector2(window.innerWidth, window.innerHeight)
    });
    this.line = new Line2(this.geometry, material);

    this.addPoint(x, y);
  }

  addPoint(x: number, y: number): void {
    this.points[3 * this.drawCount] = x;
    this.points[3 * this.drawCount + 1] = y;
    this.drawCount++;

    this.geometry.setPositions(this.points);
    this.geometry.instanceCount = this.drawCount - 1;
  }

  endLine(): void {
    this.extendToZ();
    this.reCenterOrigin();
  }

  extendToZ(): void {
    for (let i = 0; i < this.drawCount; i++) {
      this.points[3 * (this.drawCount - i) - 1] = this.points[3 * i];
    }
    this.geometry.setPositions(this.points);
  }

  reCenterOrigin(): void {
    const center = new Vector3();
    this.geometry.computeBoundingBox();
    this.geometry.boundingBox?.getCenter(center);

    this.geometry.translate(-center.x, -center.y, -center.z);
    this.line.position.set(center.x, center.y, center.z);
  }

  rotate(rate = 1): void {
    this.line.rotation.y += rate / this.drawCount;
  }

  cleanUp(): void {
    this.line.material.dispose();
    this.geometry.dispose();
    this.points = new Float32Array();
  }
}