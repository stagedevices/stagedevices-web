declare module "three" {
  export class WebGLRenderer {
    constructor(options?: unknown);
    setPixelRatio(ratio: number): void;
    setClearColor(color: number, alpha?: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(scene: Scene, camera: Camera): void;
    dispose(): void;
  }

  export class Scene {
    add(object: Object3D): void;
  }

  export class Camera {}

  export class OrthographicCamera extends Camera {
    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number);
  }

  export class PlaneGeometry {
    constructor(width?: number, height?: number);
    dispose(): void;
  }

  export class Vector2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    set(x: number, y: number): this;
  }

  export class ShaderMaterial {
    constructor(options?: unknown);
    dispose(): void;
  }

  export class Object3D {}

  export class Mesh extends Object3D {
    constructor(geometry?: PlaneGeometry, material?: ShaderMaterial);
  }
}
