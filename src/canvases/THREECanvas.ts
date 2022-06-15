import {
  Scene, Camera, WebGLRenderer, ColorRepresentation, TextureEncoding, AmbientLight, Vector3,
  Mesh, Raycaster, TextureLoader, PointLight, DirectionalLight,
} from 'three';

export abstract class THREECanvas {
  abstract camera: Camera;
  scene: Scene;
  renderer: WebGLRenderer;
  mouseLocation: Vector3;
  clickPosition: Vector3;
  mouseRaycaster: Raycaster;
  ambientLight?: AmbientLight;
  pointLight?: PointLight;

  constructor() {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance"
    });
    this.mouseLocation = new Vector3();
    this.clickPosition = new Vector3();
    this.mouseRaycaster = new Raycaster();
  }

  abstract animate(): void;

  rendererConfig(
    pixelRatio: number,
    width: number,
    height: number,
    encoding: TextureEncoding
  ): void {
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.outputEncoding = encoding;
  }

  setAmbientLight(color: ColorRepresentation): void {
    this.ambientLight = new AmbientLight(color)
    this.scene.add(this.ambientLight);
  }

  setPointLight(color: ColorRepresentation, x: number, y: number, z: number): void {
    this.pointLight = new PointLight(color);
    this.pointLight.position.set(x, y, z);
    this.scene.add(this.pointLight);
  }

  setBackgroundImage(imageUrl: string): void {
    const background = new TextureLoader().load(imageUrl);
    this.scene.background = background;
  }

  mapMouseLocation(mouseX: number, mouseY: number): Vector3 {
    this.mouseLocation.set(
      (mouseX / window.innerWidth) * 2 - 1,
      - (mouseY / window.innerHeight) * 2 + 1,
      0.5);

    this.mouseLocation.unproject(this.camera);
    this.mouseLocation.sub(this.camera.position).normalize();

    const distance = - this.camera.position.z / this.mouseLocation.z;
    this.clickPosition.copy(this.camera.position).add(this.mouseLocation.multiplyScalar(distance));

    return this.clickPosition;
  }

  meshUnderMouse(mouseX: number, mouseY: number, mesh: Mesh): boolean {
    this.mouseLocation.set(
      (mouseX / window.innerWidth) * 2 - 1,
      - (mouseY / window.innerHeight) * 2 + 1,
      0.5);
    this.mouseRaycaster.setFromCamera(this.mouseLocation, this.camera);

    const intersects = this.mouseRaycaster.intersectObjects([mesh]);
    return Boolean(intersects.length);
  }

  commonCleanUp(): void {
    this.renderer.dispose();
    this.ambientLight?.dispose();
    this.pointLight?.dispose();
  }
}