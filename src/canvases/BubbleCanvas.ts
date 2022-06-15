import { toRaw } from 'vue';

import { PerspectiveCamera, sRGBEncoding, Vector3 } from 'three';

import { THREECanvas } from "./THREECanvas";
import { Bubble } from '@/models/Bubble';
import backgroundImage from '@/assets/bubblebackground.jpg';

export class BubbleCanvas extends THREECanvas {
  override camera: PerspectiveCamera;
  heldBubble?: Bubble;
  freeBubbles: Bubble[];
  scaleRate: Vector3;

  constructor() {
    super();

    this.camera = new PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );
    this.camera.position.setZ(30);

    this.rendererConfig(
      window.devicePixelRatio,
      window.innerWidth,
      window.innerHeight,
      sRGBEncoding
    );

    this.setPointLight(0xffffff, 0, 0, 10);
    this.setBackgroundImage(backgroundImage);

    this.scaleRate = new Vector3(0.1, 0.1, 0.1);
    this.freeBubbles = [];
  }

  animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.inflateHeldBubble();
    this.floatFreeBubbles();
    this.renderer.render(toRaw(this.scene), this.camera);
  }

  placeBubble(color: string, x: number, y: number): void {
    const position = this.mapMouseLocation(x, y);
    const bubble = new Bubble(
      color,
      position.x,
      position.y,
      this.scaleRate
    );

    this.heldBubble = bubble;
    this.scene.add(bubble.mesh);
  }

  moveBubble(x: number, y: number): void {
    if (this.heldBubble) {
      const position = this.mapMouseLocation(x, y);
      this.heldBubble.setSpeedFromPositionDelta(position.x, position.y);
      this.heldBubble.setPosition(position.x, position.y);
    }
  }

  releaseBubble(): void {
    if (this.heldBubble) {
      this.freeBubbles.push(this.heldBubble);
      this.heldBubble = undefined;
    }
  }

  bubblesClicked(x: number, y: number): number[] {
    const bubblesClicked: number[] = [];
    this.freeBubbles.forEach((b, i) => {
      if (this.meshUnderMouse(x, y, b.mesh))
        bubblesClicked.push(i);
    });
    return bubblesClicked;
  }

  removeBubbles(bubbles: number[]): void {
    bubbles.forEach((b, i) => {
      this.scene.remove(this.freeBubbles[b - i].mesh);
      this.freeBubbles[b - i].cleanUp();
      this.freeBubbles.splice(b - i, 1);
    });
  }

  inflateHeldBubble(): void {
    if (this.heldBubble) {
      this.heldBubble.inflate();
    }
  }

  floatFreeBubbles(): void {
    this.freeBubbles?.map(b => {
      b.float();
      b.smoothlyReduceSpeed(0.05);

      if (b.mesh.position.x > 10 || b.mesh.position.x < -10) {
        b.bounceX();
      }
      if (b.mesh.position.y > 5 || b.mesh.position.y < -5) {
        b.bounceY();
      }
    });
  }

  cleanUp(): void {
    this.heldBubble?.cleanUp();
    this.freeBubbles.forEach(b => b.cleanUp());
    this.freeBubbles = [];
    this.commonCleanUp();
  }
}