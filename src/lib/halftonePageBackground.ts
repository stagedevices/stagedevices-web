import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uRes;
  uniform float uPitch;
  uniform float uOpacity;
  uniform vec2 uPhase;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uReduce;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 pixel = gl_FragCoord.xy + uPhase;
    vec2 cell = floor(pixel / uPitch);
    vec2 f = fract(pixel / uPitch) - 0.5;
    float dist = max(abs(f.x), abs(f.y));

    float n = hash21(cell);
    float t = uTime * 0.35 + n * 6.2831;
    float wobble = 0.5 + 0.5 * sin(t);
    float modAmp = mix(0.08, 0.04, uReduce);

    float hoverInfluence = 0.0;
    if (uHover > 0.5) {
      float d = distance(gl_FragCoord.xy, uMouse);
      hoverInfluence = smoothstep(220.0, 0.0, d);
    }

    float radius = 0.24 + (wobble - 0.5) * modAmp;
    radius += hoverInfluence * (0.06 * mix(1.0, 0.6, uReduce));

    float aa = max(0.001, fwidth(dist) * 1.35);
    float dot = 1.0 - smoothstep(radius, radius + aa, dist);

    float intensity = mix(0.85, 1.15, wobble);
    intensity += hoverInfluence * 0.12 * mix(1.0, 0.6, uReduce);

    float opacity = uOpacity * mix(1.0, 1.12, uHover);
    float alpha = clamp(dot * intensity * opacity, 0.0, 1.0);

    vec3 ink = vec3(0.0);
    gl_FragColor = vec4(ink, alpha);
  }
`;

export function installHalftonePageBackground() {
  const page = document.getElementById("page");
  if (!page) return () => undefined;

  let canvas = page.querySelector<HTMLCanvasElement>("#sd-halftone");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "sd-halftone";
    canvas.setAttribute("aria-hidden", "true");
    page.insertBefore(canvas, page.firstChild);
  }

  let renderer: THREE.WebGLRenderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch (error) {
    document.documentElement.classList.add("sd-halftone-fallback");
    return () => undefined;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uPitch: { value: 9 },
    uOpacity: { value: 0.18 },
    uPhase: { value: new THREE.Vector2(0, 0) },
    uMouse: { value: new THREE.Vector2(-9999, -9999) },
    uHover: { value: 0 },
    uReduce: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const resize = () => {
    const rect = page.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    uniforms.uRes.value.set(width, height);
  };

  resize();

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(page);

  const reduceMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  const updateReduce = () => {
    uniforms.uReduce.value = reduceMedia.matches ? 1 : 0;
  };
  updateReduce();

  if (typeof reduceMedia.addEventListener === "function") {
    reduceMedia.addEventListener("change", updateReduce);
  } else if (typeof reduceMedia.addListener === "function") {
    reduceMedia.addListener(updateReduce);
  }

  const handlePointerEnter = () => {
    uniforms.uHover.value = 1;
  };

  const handlePointerLeave = () => {
    uniforms.uHover.value = 0;
    uniforms.uMouse.value.set(-9999, -9999);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const rect = page.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
    uniforms.uMouse.value.set(x, y);
  };

  page.addEventListener("pointerenter", handlePointerEnter);
  page.addEventListener("pointerleave", handlePointerLeave);
  page.addEventListener("pointermove", handlePointerMove);

  let frameId = 0;
  let lastTime = performance.now();

  const tick = (time: number) => {
    const delta = Math.min(0.05, (time - lastTime) / 1000);
    lastTime = time;

    const speed = uniforms.uReduce.value ? 0.3 : 1;
    uniforms.uTime.value += delta * speed;

    const phase = uniforms.uPhase.value;
    phase.x += delta * speed * 0.55 * uniforms.uPitch.value;
    phase.y += delta * speed * 0.32 * uniforms.uPitch.value;

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);

  const cleanup = () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    page.removeEventListener("pointerenter", handlePointerEnter);
    page.removeEventListener("pointerleave", handlePointerLeave);
    page.removeEventListener("pointermove", handlePointerMove);

    if (typeof reduceMedia.removeEventListener === "function") {
      reduceMedia.removeEventListener("change", updateReduce);
    } else if (typeof reduceMedia.removeListener === "function") {
      reduceMedia.removeListener(updateReduce);
    }

    material.dispose();
    geometry.dispose();
    renderer.dispose();
  };

  window.addEventListener("beforeunload", cleanup, { once: true });

  return cleanup;
}
