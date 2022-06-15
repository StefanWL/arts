import { ColorRepresentation, Vector2 } from "three";
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';
import { tint } from 'tint-shade-color';


export class RotorLine {
  line: Line2;
  geometry: LineGeometry;
  rIn: number;
  rOut: number;
  points: Float32Array;

  constructor(rIn: number, rOut: number, angleIn: number, angleOut: number, color: ColorRepresentation) {
    const lightColor = tint(color, 0.5);
    this.rIn = rIn;
    this.rOut = rOut;

    this.points = new Float32Array(120);
    this.geometry = new LineGeometry();
    this.setPoints(angleIn, angleOut);


    const material = new LineMaterial({
      color: lightColor as number,
      linewidth: 4,
      resolution: new Vector2(window.innerWidth, window.innerHeight)
    });
    this.line = new Line2(this.geometry, material);
  }

  setPoints(angleIn: number, angleOut: number): void {
    const pointCount = this.points.length / 3;
    const segmentRadialLength = (this.rOut - this.rIn) / (pointCount - 1);
    const segmentAngularLength = (angleIn - angleOut) / (pointCount - 1);

    for (let i = 0; i < pointCount; i++) {
      const r = this.rIn + i * segmentRadialLength;
      const a = angleIn + i * segmentAngularLength;

      this.points[3 * i] = r * Math.cos(a);
      this.points[3 * i + 1] = r * Math.sin(a);
    }

    this.geometry.setPositions(this.points);
  }

  updateColor(color: ColorRepresentation): void {
    const lightColor = tint(color, 0.5);
    this.line.material.color.set(lightColor);
  }

  cleanUp(): void {
    this.line.material.dispose();
    this.geometry.dispose();
    this.points = new Float32Array();
  }
}