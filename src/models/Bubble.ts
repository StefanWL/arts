import { Material, Mesh, MeshPhysicalMaterial, SphereGeometry, Vector3 } from "three";

export class Bubble {
  mesh: Mesh;
  material: MeshPhysicalMaterial;
  speed: Vector3;
  inflationRate: Vector3;

  constructor(color: string, x: number, y: number, scaleRate: Vector3) {
    const geometry = new SphereGeometry(0.05, 50, 50);
    this.material = new MeshPhysicalMaterial({
      color: color,
      clearcoat: 1,
      transmission: 0.9,
      specularIntensity: 1,
      transparent: true,
      opacity: .2,
      ior: 2,
    });
    this.material.thickness = 0.1;

    this.inflationRate = scaleRate;
    this.speed = new Vector3();
    this.mesh = new Mesh(geometry, this.material);
    this.setPosition(x, y);
  }

  inflate(): void {
    this.mesh.scale.add(this.inflationRate);
  }

  float(): void {
    this.mesh.position.add(this.speed);
  }

  setPosition(x: number, y: number): void {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
  }

  setSpeedFromPositionDelta(x: number, y: number): void {
    this.speed.x = x - this.mesh.position.x;
    this.speed.y = y - this.mesh.position.y;
  }

  smoothlyReduceSpeed(target: number, rate = 0.02): void {
    const scalarSpeed = this.speed.length();
    if (scalarSpeed > target) {
      this.speed.multiplyScalar(1 - rate * Math.sqrt(scalarSpeed - target));
    }
  }

  bounceX(): void {
    this.speed.x = -this.speed.x;
  }

  bounceY(): void {
    this.speed.y = -this.speed.y;
  }

  cleanUp(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}