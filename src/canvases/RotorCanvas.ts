import { toRaw } from 'vue';

import { sRGBEncoding, PerspectiveCamera, ColorRepresentation } from 'three';

import { THREECanvas } from "./THREECanvas";
import { Rotor } from '@/models/Rotor';
import { RotorLine } from '@/models/RotorLine';

export class RotorCanvas extends THREECanvas {
  override camera: PerspectiveCamera;
  color: ColorRepresentation;
  lines: RotorLine[][];
  rotors: Rotor[];
  grabbedRotor?: Rotor;

  constructor(color: ColorRepresentation) {
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

    this.color = color;
    this.renderer.setClearColor(0x000000);

    this.rotors = [];
    this.lines = [[], [], []];

    const tau = 2 * Math.PI;
    for (let i = 0; i < 3; i++) {
      const rotor = new Rotor(i + 1, 0.1, color);
      this.rotors.push(rotor);
      this.scene.add(rotor.mesh)

      for (let j = 0; j < 12; j++) {
        const line = new RotorLine(i + 0.1, i + 0.9, tau * j / 12, tau * (j + 1) / 12, this.color);
        this.lines[i].push(line);
        this.scene.add(line.line)
      }
    }
  }

  animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    const tau = 2 * Math.PI;
    this.rotors.filter(r => !r.isGrabbed).forEach(r => {
      r.releaseSpringForce();
      r.rotateFromMomentum();
    })
    this.lines.forEach((r, i) => {
      let innerRotation = 0;
      if (this.rotors[i - 1])
        innerRotation = this.rotors[i - 1].mesh.rotation.z;

      const outerRotation = this.rotors[i].mesh.rotation.z;
      r.forEach((l, j) => {
        l.setPoints(tau * j / 12 + innerRotation, tau * (j + 1) / 12 - outerRotation + 2 * innerRotation)
      })
    })
    this.renderer.render(toRaw(this.scene), this.camera);
  }

  setGrabbedRotor(x: number, y: number): void {
    this.rotors.forEach(r => {
      const grabbed = this.meshUnderMouse(x, y, r.mesh);
      if (grabbed) {
        const position = this.mapMouseLocation(x, y);
        this.grabbedRotor = r;
        this.grabbedRotor.grab(position.x, position.y);
      }
    })
  }

  releaseGrabbedRotor(): void {
    if (this.grabbedRotor) {
      this.grabbedRotor.release();
      this.grabbedRotor = undefined;
    }
  }

  rotateGrabbedRotor(x: number, y: number): void {
    if (this.grabbedRotor) {
      const position = this.mapMouseLocation(x, y);
      this.grabbedRotor.turn(position.x, position.y);
    }
  }

  updateColor(color: ColorRepresentation): void {
    this.lines.forEach(r => {
      r.forEach(l => {
        l.updateColor(color);
      })
    })
    this.rotors.forEach(r => r.setColor(color));
  }

  cleanUp(): void {
    this.grabbedRotor?.cleanUp();
    this.rotors.forEach(r => r.cleanUp());
    this.rotors = [];
    this.lines.forEach(r => r.forEach(l => l.cleanUp()));
    this.lines = [];
    this.commonCleanUp();
  }
}