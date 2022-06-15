import { toRaw } from 'vue';

import { sRGBEncoding, PerspectiveCamera } from 'three';

import { THREECanvas } from "./THREECanvas";
import { Line } from "@/models/Line"
import backgroundImage from '@/assets/linebackground.jpg';

export class LineCanvas extends THREECanvas {
  override camera: PerspectiveCamera;
  activeLine?: Line;
  lines: Line[];
  lineMaxLength: number;

  constructor() {
    super();

    this.camera = new PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );
    this.camera.position.setZ(30);

    this.rendererConfig(
      window.devicePixelRatio,
      window.innerWidth,
      window.innerHeight,
      sRGBEncoding
    );

    this.setAmbientLight(0xffffff);
    this.setBackgroundImage(backgroundImage);

    this.lineMaxLength = 1000;
    this.lines = [];
  }

  animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.activeLine?.line.computeLineDistances();
    this.lines.forEach((l, i) => l.rotate(2 * (i % 2) - 1));
    this.renderer.render(toRaw(this.scene), this.camera);
  }

  startLine(color: string, x: number, y: number): void {
    const position = this.mapMouseLocation(x, y);
    const line = new Line(color, position.x, position.y, this.lineMaxLength);

    this.activeLine = line;
    this.scene.add(line.line);
  }

  extendActiveLine(x: number, y: number): void {
    if (this.activeLine) {
      const position = this.mapMouseLocation(x, y);
      this.activeLine?.addPoint(position.x, position.y);
    }
  }

  endLine(): void {
    if (this.activeLine) {
      this.lines.push(this.activeLine);
      this.activeLine.endLine();
      this.activeLine = undefined;
    }
  }

  cleanUp(): void {
    this.activeLine?.cleanUp();
    this.lines.forEach(l => l.cleanUp());
    this.lines = [];
    this.commonCleanUp();
  }
}