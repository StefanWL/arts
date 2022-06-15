import { ColorRepresentation, Mesh, MeshBasicMaterial, TorusGeometry, Vector2 } from "three";
import { shade } from 'tint-shade-color';

export class Rotor {
  mesh: Mesh;
  material: MeshBasicMaterial;
  rotationRate: number;
  heldPosition: Vector2;
  draggedPosition: Vector2;
  isGrabbed: boolean;

  constructor(radius: number, tube: number, color: ColorRepresentation) {
    const geometry = new TorusGeometry(radius, tube, 8, 50);
    this.material = new MeshBasicMaterial();
    this.mesh = new Mesh(geometry, this.material);
    this.setColor(color);

    this.rotationRate = 0;
    this.heldPosition = new Vector2();
    this.draggedPosition = new Vector2();
    this.isGrabbed = false;
  }

  grab(x: number, y: number): void {
    this.rotationRate = 0;
    this.heldPosition.x = x;
    this.heldPosition.y = y;
    this.isGrabbed = true;
  }

  turn(x: number, y: number): void {
    this.draggedPosition.x = x;
    this.draggedPosition.y = y;

    const heldAngle = this.heldPosition.angle();
    const draggedAngle = this.draggedPosition.angle();

    this.mesh.rotation.z += this.shortestAngleDelta(heldAngle, draggedAngle);

    this.heldPosition.x = x;
    this.heldPosition.y = y;
  }

  release(): void {
    this.heldPosition.x = 0;
    this.heldPosition.y = 0;
    this.isGrabbed = false;
  }

  releaseSpringForce(): void {
    this.rotationRate -= 0.0003 * this.mesh.rotation.z;
  }

  rotateFromMomentum(): void {
    this.mesh.rotation.z += this.rotationRate;
  }

  shortestAngleDelta(a: number, b: number): number {
    if (Math.abs(b - a) < Math.abs(b - 2 * Math.PI - a))
      return b - a;
    else
      return b - 2 * Math.PI - a
  }

  setColor(color: ColorRepresentation): void {
    const darkColor = shade(color, 0.6);
    this.material.color.set(darkColor);
  }

  cleanUp(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}