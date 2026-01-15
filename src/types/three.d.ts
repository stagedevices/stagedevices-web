declare module "three" {
  export class WebGLRenderer {
    constructor(options?: {
      canvas?: HTMLCanvasElement;
      alpha?: boolean;
      antialias?: boolean;
      powerPreference?: string;
    });
    setClearColor(color: number, alpha: number): void;
    setPixelRatio(ratio: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(scene: unknown, camera: unknown): void;
    dispose(): void;
  }

  export class Scene {
    add(object: unknown): void;
  }

  export class OrthographicCamera {
    constructor(left: number, right: number, top: number, bottom: number, near?: number, far?: number);
  }

  export class PlaneGeometry {
    constructor(width: number, height: number);
    dispose(): void;
  }

  export class ShaderMaterial {
    constructor(params: {
      transparent?: boolean;
      uniforms?: Record<string, { value: unknown }>;
      vertexShader?: string;
      fragmentShader?: string;
    });
    uniforms: Record<string, { value: any }>;
    dispose(): void;
  }

  export class Mesh {
    constructor(geometry: unknown, material: unknown);
    removeFromParent(): void;
  }

  export class Vector2 {
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
  }
}
