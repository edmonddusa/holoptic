import { useEffect, useRef } from "react";

// A field of dots on a gently moving surface, drawn with plain WebGL.
// The pointer raises a soft swell with rings running out from it; the swell
// trails the pointer and fades away when the pointer leaves.

const VERTEX = `
attribute vec2 aGrid;          // (x, z) on the ground plane
uniform mat4 uViewProj;
uniform float uTime;
uniform vec2 uPointer;         // pointer position on the ground plane
uniform float uPointerAmount;  // 0..1, eases in and out
uniform float uDotScale;
varying float vCrest;
varying float vFocus;
varying float vFar;

void main() {
  vec2 g = aGrid;
  float t = uTime;

  // Three slow swells travelling in different directions.
  float h = 0.55 * sin(dot(g, vec2(0.21, 0.13)) + t * 0.55)
          + 0.30 * sin(dot(g, vec2(-0.12, 0.31)) - t * 0.42)
          + 0.15 * sin(dot(g, vec2(0.47, -0.09)) + t * 0.9);
  // Calm the far left and right edges.
  h *= 1.0 - 0.6 * smoothstep(10.0, 18.0, abs(g.x));

  // Pointer swell: a Gaussian bump with rings moving outwards.
  float d = distance(g, uPointer);
  float focus = exp(-d * d / 6.0) * uPointerAmount;
  float rings = sin(d * 2.4 - t * 3.0) * exp(-d * d / 30.0) * uPointerAmount;
  float y = h * 1.9 + focus * 1.0 + rings * 0.1;

  gl_Position = uViewProj * vec4(g.x, y, g.y, 1.0);

  vCrest = clamp(h * 0.6 + 0.5, 0.0, 1.0);
  vFocus = focus;
  vFar = clamp((3.0 - g.y) / 22.0, 0.0, 1.0);
  gl_PointSize = uDotScale * (1.0 + focus * 0.45) * (1.25 - vFar * 0.5);
}
`;

const FRAGMENT = `
precision mediump float;
uniform vec3 uDeep;
uniform vec3 uGold;
uniform vec3 uCream;
uniform float uOpacity;
varying float vCrest;
varying float vFocus;
varying float vFar;

void main() {
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float edge = 1.0 - smoothstep(0.25, 0.5, r);

  vec3 c = mix(uDeep, uGold, smoothstep(0.15, 0.6, vCrest));
  c = mix(c, uCream, smoothstep(0.65, 1.0, vCrest) * 0.7);
  c = mix(c, uCream, vFocus * 0.45);

  float a = min(1.0, edge * mix(1.0, 0.2, vFar) * (0.85 + vFocus * 0.35) * uOpacity);
  gl_FragColor = vec4(c * a, a);
}
`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

const CAMERA = { pos: [0, 6.5, 9], target: [0, -1.5, -6], fov: 44 };

function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function norm(a) { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

// Column-major view-projection matrix plus the camera basis for picking.
function camera(aspect) {
  const f = norm(sub(CAMERA.target, CAMERA.pos));
  const r = norm(cross(f, [0, 1, 0]));
  const u = cross(r, f);
  const e = CAMERA.pos;
  const view = [
    r[0], u[0], -f[0], 0,
    r[1], u[1], -f[1], 0,
    r[2], u[2], -f[2], 0,
    -dot(r, e), -dot(u, e), dot(f, e), 1,
  ];
  const tanHalf = Math.tan((CAMERA.fov * Math.PI) / 360);
  const near = 0.1, far = 60;
  const p = [
    1 / (tanHalf * aspect), 0, 0, 0,
    0, 1 / tanHalf, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0,
  ];
  const vp = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let row = 0; row < 4; row++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += p[k * 4 + row] * view[c * 4 + k];
      vp[c * 4 + row] = s;
    }
  return { vp, f, r, u, tanHalf, aspect };
}

// Where a ray through the given screen point hits the y = 0 plane.
function pick(cam, nx, ny) {
  const sx = nx * cam.tanHalf * cam.aspect, sy = ny * cam.tanHalf;
  const d = [0, 1, 2].map((i) => cam.f[i] + cam.r[i] * sx + cam.u[i] * sy);
  if (d[1] >= -1e-4) return null;
  const t = -CAMERA.pos[1] / d[1];
  return [CAMERA.pos[0] + d[0] * t, CAMERA.pos[2] + d[2] * t];
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

const TONES = {
  // Glowing dots on a dark background (additive blending).
  dark: { deep: "#2b4a63", gold: "#c9a46c", accent: "#f6ead2", additive: true, opacity: 1 },
  // Ink-like dots on a light background (normal blending).
  light: { deep: "#c4b393", gold: "#b08a52", accent: "#7d5c2e", additive: false, opacity: 0.85 },
};

export default function WaveField({ className, tone = "dark" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl) return;

    const prog = gl.createProgram();
    try {
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    } catch (err) {
      console.warn("WaveField: shader failed", err);
      return;
    }
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const small = window.matchMedia("(max-width: 850px)").matches;
    const cols = small ? 160 : 280, rows = small ? 90 : 140;
    const grid = new Float32Array(cols * rows * 2);
    let i = 0;
    for (let z = 0; z < rows; z++)
      for (let x = 0; x < cols; x++) {
        grid[i++] = (x / (cols - 1) - 0.5) * 36;
        grid[i++] = 3 - (z / (rows - 1)) * 22;
      }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);
    const aGrid = gl.getAttribLocation(prog, "aGrid");
    gl.enableVertexAttribArray(aGrid);
    gl.vertexAttribPointer(aGrid, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    const uViewProj = U("uViewProj"), uTime = U("uTime"), uPointer = U("uPointer"),
      uPointerAmount = U("uPointerAmount"), uDotScale = U("uDotScale");
    const palette = TONES[tone] || TONES.dark;
    gl.uniform3fv(U("uDeep"), hex(palette.deep));
    gl.uniform3fv(U("uGold"), hex(palette.gold));
    gl.uniform3fv(U("uCream"), hex(palette.accent));
    gl.uniform1f(U("uOpacity"), palette.opacity);

    gl.enable(gl.BLEND);
    // Additive makes overlapping dots glow on dark; on light, plain alpha blending.
    if (palette.additive) gl.blendFunc(gl.ONE, gl.ONE);
    else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let cam, dpr = 1;
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      cam = camera(w / h);
      gl.uniformMatrix4fv(uViewProj, false, cam.vp);
      gl.uniform1f(uDotScale, (small ? 2.0 : 2.4) * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pointer: target point on the plane, a trailing point, and an eased amount.
    let target = null;
    const trail = [0, 0];
    let amount = 0;
    const onMove = (e) => {
      if (!cam) return;
      const b = canvas.getBoundingClientRect();
      const nx = ((e.clientX - b.left) / b.width) * 2 - 1;
      const ny = 1 - ((e.clientY - b.top) / b.height) * 2;
      const inside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
      const hit = inside ? pick(cam, nx, ny) : null;
      if (hit && !target) { trail[0] = hit[0]; trail[1] = hit[1]; }
      target = hit;
    };
    const onLeave = () => { target = null; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true, raf = 0, last = performance.now(), time = 8;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(canvas);

    const draw = () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointer, trail[0], trail[1]);
      gl.uniform1f(uPointerAmount, amount);
      gl.drawArrays(gl.POINTS, 0, cols * rows);
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (!visible || document.hidden) return;
      time += dt;
      if (target) {
        const k = 1 - Math.exp(-dt * 7); // frame-rate independent easing
        trail[0] += (target[0] - trail[0]) * k;
        trail[1] += (target[1] - trail[1]) * k;
      }
      amount += ((target ? 1 : 0) - amount) * (1 - Math.exp(-dt * 3));
      draw();
    };

    if (reduced) draw();
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [tone]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
