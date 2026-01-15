import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const simFragmentShader = `
  precision highp float;

  uniform sampler2D tState;
  uniform vec2 uSimSize;
  uniform float uTime;
  uniform float uTick;
  uniform float uReseed;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uHoverRadius;
  uniform float uMaskScale;
  uniform float uMaskSpeed;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float decodeState(float r) {
    if (r < 0.25) return 0.0;
    if (r < 0.75) return 1.0;
    return 2.0;
  }

  float encodeState(float s) {
    if (s < 0.5) return 0.0;
    if (s < 1.5) return 0.5;
    return 1.0;
  }

  float sampleState(vec2 coord) {
    vec2 uv = (coord + 0.5) / uSimSize;
    uv = clamp(uv, vec2(0.0), vec2(1.0));
    return decodeState(texture2D(tState, uv).r);
  }

  void main() {
    vec2 cell = floor(gl_FragCoord.xy);
    float state = sampleState(cell);

    float onCount = 0.0;
    onCount += sampleState(cell + vec2(-1.0, -1.0)) == 1.0 ? 1.0 : 0.0;
    onCount += sampleState(cell + vec2(0.0, -1.0)) == 1.0 ? 1.0 : 0.0;
    onCount += sampleState(cell + vec2(1.0, -1.0)) == 1.0 ? 1.0 : 0.0;
    onCount += sampleState(cell + vec2(-1.0, 0.0)) == 1.0 ? 1.0 : 0.0;
    onCount += sampleState(cell + vec2(1.0, 0.0)) == 1.0 ? 1.0 : 0.0;
    onCount += sampleState(cell + vec2(-1.0, 1.0)) == 1.0 ? 1.0 : 0.0;
    onCount += sampleState(cell + vec2(0.0, 1.0)) == 1.0 ? 1.0 : 0.0;
    onCount += sampleState(cell + vec2(1.0, 1.0)) == 1.0 ? 1.0 : 0.0;

    vec2 drift = vec2(uTime * uMaskSpeed, uTime * uMaskSpeed * 0.6);
    vec2 maskCoord = (cell / uMaskScale) + drift;
    float maskNoise = noise(maskCoord);
    float band = 0.5 + 0.5 * sin((cell.y / (uMaskScale * 0.85)) + uTime * uMaskSpeed * 4.5);
    float mask = mix(maskNoise, band, 0.45);
    bool insideMask = mask > 0.52;

    float influence = 0.0;
    if (uHover > 0.5) {
      float dist = distance(cell + vec2(0.5), uMouse);
      influence = smoothstep(uHoverRadius, 0.0, dist);
    }

    float nextState = state;
    if (state == 0.0) {
      bool birth = (onCount == 2.0);
      if (uHover > 0.5 && influence > 0.4 && onCount == 1.0) {
        birth = true;
      }
      if (!insideMask) {
        birth = false;
      }
      if (birth) {
        nextState = 1.0;
      } else {
        nextState = 0.0;
      }
      if (insideMask) {
        float rnd = hash21(cell + uTick * vec2(0.13, 0.37));
        float spark = 0.004 * influence;
        if (rnd < (uReseed + spark)) {
          nextState = 1.0;
        }
      }
    } else if (state == 1.0) {
      nextState = 2.0;
    } else {
      nextState = 0.0;
    }

    gl_FragColor = vec4(encodeState(nextState), 0.0, 0.0, 1.0);
  }
`;

const displayFragmentShader = `
  precision highp float;

  uniform sampler2D tState;
  uniform vec2 uRes;
  uniform float uPitch;
  uniform vec2 uSimSize;
  uniform vec2 uGridSize;

  float decodeState(float r) {
    if (r < 0.25) return 0.0;
    if (r < 0.75) return 1.0;
    return 2.0;
  }

  void main() {
    vec2 cellScreen = floor(gl_FragCoord.xy / uPitch);
    if (cellScreen.x >= uGridSize.x || cellScreen.y >= uGridSize.y) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec2 simCoord = floor((cellScreen + 0.5) * (uSimSize / uGridSize));
    vec2 simUv = (simCoord + 0.5) / uSimSize;
    float state = decodeState(texture2D(tState, simUv).r);

    vec2 f = fract(gl_FragCoord.xy / uPitch) - 0.5;
    float dist = max(abs(f.x), abs(f.y));
    float aa = max(0.001, fwidth(dist) * 1.2);
    float square = 1.0 - smoothstep(0.5, 0.5 + aa, dist);

    float alpha = 0.0;
    if (state == 1.0) {
      alpha = 0.18;
    } else if (state == 2.0) {
      alpha = 0.08;
    }

    vec3 ink = vec3(0.0);
    gl_FragColor = vec4(ink, alpha * square);
  }
`;

const initFragmentShader = `
  precision highp float;

  uniform vec2 uSimSize;
  uniform float uSeed;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 cell = floor(gl_FragCoord.xy);
    float rnd = hash21(cell + uSeed * vec2(0.17, 0.91));
    float state = rnd < 0.02 ? 0.5 : 0.0;
    gl_FragColor = vec4(state, 0.0, 0.0, 1.0);
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

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);

  const simUniforms = {
    tState: { value: null as unknown },
    uSimSize: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uTick: { value: 0 },
    uReseed: { value: 0.0008 },
    uHover: { value: 0 },
    uMouse: { value: new THREE.Vector2(-9999, -9999) },
    uHoverRadius: { value: 24 },
    uMaskScale: { value: 28 },
    uMaskSpeed: { value: 0.08 },
  };

  const displayUniforms = {
    tState: { value: null as unknown },
    uRes: { value: new THREE.Vector2(1, 1) },
    uPitch: { value: 9 },
    uSimSize: { value: new THREE.Vector2(1, 1) },
    uGridSize: { value: new THREE.Vector2(1, 1) },
  };

  const simMaterial = new THREE.ShaderMaterial({
    uniforms: simUniforms,
    vertexShader,
    fragmentShader: simFragmentShader,
  });

  const displayMaterial = new THREE.ShaderMaterial({
    uniforms: displayUniforms,
    vertexShader,
    fragmentShader: displayFragmentShader,
    transparent: true,
  });

  const initUniforms = {
    uSimSize: { value: new THREE.Vector2(1, 1) },
    uSeed: { value: 0 },
  };

  const initMaterial = new THREE.ShaderMaterial({
    uniforms: initUniforms,
    vertexShader,
    fragmentShader: initFragmentShader,
  });

  const simScene = new THREE.Scene();
  const simMesh = new THREE.Mesh(geometry, simMaterial);
  simScene.add(simMesh);

  const displayScene = new THREE.Scene();
  const displayMesh = new THREE.Mesh(geometry, displayMaterial);
  displayScene.add(displayMesh);

  const initScene = new THREE.Scene();
  const initMesh = new THREE.Mesh(geometry, initMaterial);
  initScene.add(initMesh);

  const pitchPx = 9;
  const minSimWidth = 360;
  const maxSimWidth = 480;

  type RenderTarget = { texture: unknown; dispose: () => void };
  type RenderTargetCtor = new (width: number, height: number, options: unknown) => RenderTarget;
  const {
    WebGLRenderTarget,
    NearestFilter,
    RGBAFormat,
    UnsignedByteType,
  } = THREE as unknown as {
    WebGLRenderTarget: RenderTargetCtor;
    NearestFilter: number;
    RGBAFormat: number;
    UnsignedByteType: number;
  };

  let renderTargetA: RenderTarget | undefined;
  let renderTargetB: RenderTarget | undefined;
  let simScaleX = 1;
  let simScaleY = 1;

  const createRenderTargets = (width: number, height: number) => {
    if (renderTargetA) renderTargetA.dispose();
    if (renderTargetB) renderTargetB.dispose();

    const options = {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: false,
      stencilBuffer: false,
      format: RGBAFormat,
      type: UnsignedByteType,
    };

    renderTargetA = new WebGLRenderTarget(width, height, options);
    renderTargetB = new WebGLRenderTarget(width, height, options);

    initUniforms.uSimSize.value.set(width, height);
    initUniforms.uSeed.value = Math.random() * 1000;
    (renderer as unknown as { setRenderTarget: (target: RenderTarget | null) => void }).setRenderTarget(
      renderTargetA,
    );
    renderer.render(initScene, camera);
    (renderer as unknown as { setRenderTarget: (target: RenderTarget | null) => void }).setRenderTarget(null);
  };

  const resize = () => {
    const rect = page.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    displayUniforms.uRes.value.set(width, height);

    const gridW = Math.ceil(width / pitchPx);
    const gridH = Math.ceil(height / pitchPx);
    const rawSimW = gridW;
    const simW = Math.min(maxSimWidth, Math.max(minSimWidth, rawSimW));
    const simH = Math.max(1, Math.round(simW * (height / width)));

    displayUniforms.uPitch.value = pitchPx;
    displayUniforms.uGridSize.value.set(gridW, gridH);
    displayUniforms.uSimSize.value.set(simW, simH);
    simUniforms.uSimSize.value.set(simW, simH);

    simScaleX = simW / gridW;
    simScaleY = simH / gridH;
    simUniforms.uHoverRadius.value = (220 / pitchPx) * simScaleX;

    createRenderTargets(simW, simH);
    if (renderTargetA) {
      displayUniforms.tState.value = renderTargetA.texture;
      simUniforms.tState.value = renderTargetA.texture;
    }
  };

  resize();

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(page);

  const reduceMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  const updateReduce = () => {
    const reduced = reduceMedia.matches;
    simUniforms.uReseed.value = reduced ? 0.0003 : 0.0008;
    simUniforms.uMaskSpeed.value = reduced ? 0.08 * 0.3 : 0.08;
  };
  updateReduce();

  if (typeof reduceMedia.addEventListener === "function") {
    reduceMedia.addEventListener("change", updateReduce);
  } else if (typeof reduceMedia.addListener === "function") {
    reduceMedia.addListener(updateReduce);
  }

  const handlePointerEnter = () => {
    simUniforms.uHover.value = 1;
  };

  const handlePointerLeave = () => {
    simUniforms.uHover.value = 0;
    simUniforms.uMouse.value.set(-9999, -9999);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const rect = page.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
    const cellX = x / pitchPx;
    const cellY = y / pitchPx;
    simUniforms.uMouse.value.set(cellX * simScaleX, cellY * simScaleY);
  };

  page.addEventListener("pointerenter", handlePointerEnter);
  page.addEventListener("pointerleave", handlePointerLeave);
  page.addEventListener("pointermove", handlePointerMove);

  let frameId = 0;
  let lastTime = performance.now();
  let accumulator = 0;
  let simTime = 0;
  let simTick = 0;
  const baseSimRate = 45;

  const tick = (time: number) => {
    const delta = Math.min(0.05, (time - lastTime) / 1000);
    lastTime = time;

    const reduced = reduceMedia.matches;
    const speed = reduced ? 0.3 : 1;
    const simRate = baseSimRate * speed;
    const step = 1 / simRate;
    accumulator += delta;

    while (accumulator >= step) {
      if (!renderTargetA || !renderTargetB) break;
      accumulator -= step;
      simTime += step * speed;
      simTick += 1;
      simUniforms.uTime.value = simTime;
      simUniforms.uTick.value = simTick;
      simUniforms.tState.value = renderTargetA.texture;

      (renderer as unknown as { setRenderTarget: (target: RenderTarget | null) => void }).setRenderTarget(
        renderTargetB,
      );
      renderer.render(simScene, camera);
      (renderer as unknown as { setRenderTarget: (target: RenderTarget | null) => void }).setRenderTarget(null);

      const temp = renderTargetA;
      renderTargetA = renderTargetB;
      renderTargetB = temp;
      displayUniforms.tState.value = renderTargetA.texture;
    }

    renderer.render(displayScene, camera);
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

    simMaterial.dispose();
    displayMaterial.dispose();
    initMaterial.dispose();
    geometry.dispose();
    renderTargetA?.dispose();
    renderTargetB?.dispose();
    renderer.dispose();
  };

  window.addEventListener("beforeunload", cleanup, { once: true });

  return cleanup;
}
