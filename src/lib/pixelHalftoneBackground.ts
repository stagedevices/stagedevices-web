import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Vector2,
} from "three";

type PixelHalftoneUniforms = {
  uTime: { value: number };
  uResolution: { value: Vector2 };
  uPitchPx: { value: number };
  uOpacity: { value: number };
  uFlickerHz: { value: number };
  uDriftSpeed: { value: number };
  uHover: { value: number };
};

export function installPixelHalftoneBackground(): () => void {
  const page = document.getElementById("page");
  if (!page) {
    return () => {};
  }

  const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  let canvas: HTMLCanvasElement | null = null;
  let renderer: WebGLRenderer | null = null;
  let material: ShaderMaterial | null = null;
  let geometry: PlaneGeometry | null = null;
  let mesh: Mesh | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let rafId = 0;
  let uniforms: PixelHalftoneUniforms | null = null;

  const cleanup = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    page.removeEventListener("pointerenter", handlePointerEnter);
    page.removeEventListener("pointerleave", handlePointerLeave);
    reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
    page.classList.remove("is-hovering");
    page.classList.remove("has-webgl");
    page.classList.remove("no-webgl");

    if (mesh) {
      mesh.removeFromParent();
      mesh = null;
    }
    if (geometry) {
      geometry.dispose();
      geometry = null;
    }
    if (material) {
      material.dispose();
      material = null;
    }
    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
    if (canvas && canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
    canvas = null;
    uniforms = null;
  };

  const handlePointerEnter = () => {
    page.classList.add("is-hovering");
    if (uniforms) {
      uniforms.uOpacity.value = 0.28;
      uniforms.uHover.value = 1.0;
    }
  };

  const handlePointerLeave = () => {
    page.classList.remove("is-hovering");
    if (uniforms) {
      uniforms.uOpacity.value = 0.22;
      uniforms.uHover.value = 0.0;
    }
  };

  const handleReducedMotionChange = () => {
    if (!uniforms) return;
    if (reducedMotionQuery.matches) {
      uniforms.uFlickerHz.value = 3.0;
      uniforms.uDriftSpeed.value = 0.008;
    } else {
      uniforms.uFlickerHz.value = 12.0;
      uniforms.uDriftSpeed.value = 0.025;
    }
  };

  try {
    canvas = document.createElement("canvas");
    canvas.id = "sd-pixel-halftone";
    canvas.setAttribute("aria-hidden", "true");
    page.insertBefore(canvas, page.firstChild);

    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    geometry = new PlaneGeometry(2, 2);
    uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new Vector2(1, 1) },
      uPitchPx: { value: 9.0 },
      uOpacity: { value: 0.22 },
      uFlickerHz: { value: reducedMotionQuery.matches ? 3.0 : 12.0 },
      uDriftSpeed: { value: reducedMotionQuery.matches ? 0.008 : 0.025 },
      uHover: { value: 0.0 },
    };
    material = new ShaderMaterial({
      transparent: true,
      uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uPitchPx;
        uniform float uOpacity;
        uniform float uFlickerHz;
        uniform float uDriftSpeed;
        uniform float uHover;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          vec2 frag = gl_FragCoord.xy;
          vec2 cell = floor(frag / uPitchPx);
          vec2 cellUV = fract(frag / uPitchPx) - 0.5;
          vec2 p = cellUV * uPitchPx;

          float tStep = floor(uTime * uFlickerHz) / uFlickerHz;
          vec2 drift = vec2(uTime * uDriftSpeed, uTime * uDriftSpeed * 0.73);
          float flicker = hash(cell + drift + vec2(tStep, tStep * 1.37));
          float flickerBoost = mix(flicker, pow(flicker, 0.5), uHover);

          float size = uPitchPx * (0.4 + 0.25 * flickerBoost);
          float halfSize = size * 0.5;
          float d = max(abs(p.x), abs(p.y)) - halfSize;
          float aa = fwidth(d);
          float square = 1.0 - smoothstep(0.0, aa, d);

          float contrast = mix(0.65, 1.0, flickerBoost);
          float alpha = square * contrast;

          gl_FragColor = vec4(0.0, 0.0, 0.0, alpha * uOpacity);
        }
      `,
    });

    mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      if (!renderer || !uniforms) return;
      const rect = page.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(page);
    resize();

    if (hoverQuery.matches) {
      page.addEventListener("pointerenter", handlePointerEnter);
      page.addEventListener("pointerleave", handlePointerLeave);
    }

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    const render = (time: number) => {
      if (!renderer || !uniforms) return;
      uniforms.uTime.value = time / 1000;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    page.classList.add("has-webgl");
    page.classList.remove("no-webgl");
  } catch (error) {
    if (canvas && canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
    page.classList.add("no-webgl");
    canvas = null;
    return cleanup;
  }

  return cleanup;
}
