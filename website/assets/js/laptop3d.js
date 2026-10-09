/* ==========================================================================
   Interactive 3D laptop for the "Website Design" service card.
   The screen shows lajuorder.com and slowly scrolls like a live browser.
   Drag (mouse or horizontal swipe) to rotate. Loaded on demand from main.js.
   ========================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const IMG = 'assets/img/laju/';
const SITE = 'lajuorder.com';

// model dimensions (scene units)
const W = 3.2;      // base width
const D = 2.2;      // base depth
const H = 0.09;     // base thickness
const LH = 2.08;    // lid height
const LT = 0.045;   // lid thickness
const SW = 3.0;     // display width
const SH = 1.84;    // display height
const BAR = 0.1;    // browser bar height on the display

const LID_CLOSED = Math.PI / 2 - 0.012;
const LID_OPEN = -0.32;
const BASE_YAW = 0; // straight-on, centred

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t) => { const c = 1.25; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/* ---------- canvas-drawn textures ---------- */
// Draws the keyboard well, speaker grilles and trackpad, and returns the key layout
// (in canvas pixels) so the keys themselves can be built as real 3D caps.
function deckTexture() {
  const cw = 4096;
  const ch = Math.round(cw * (D - 0.08) / (W - 0.08));
  const k = cw / 2048; // stroke/dot scale
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const g = c.getContext('2d');

  // keyboard (canvas top = hinge side)
  const kx = cw * 0.125;
  const kw = cw * 0.75;
  const ky = ch * 0.075;
  const u = kw / 15;
  const gap = u * 0.13;
  const rows = [
    { h: 0.55, keys: [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5] },
    { h: 1, keys: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2] },
    { h: 1, keys: [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5] },
    { h: 1, keys: [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2] },
    { h: 1, keys: [2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.7] },
    { h: 1, keys: [1, 1, 1, 1.3, 5.4, 1.3, 1, 'arrows'] }
  ];
  const totalH = rows.reduce((a, r) => a + r.h * u, 0);
  const keys = [];
  let y = ky;
  rows.forEach((row) => {
    let x = kx;
    const rh = row.h * u;
    row.keys.forEach((kk) => {
      if (kk === 'arrows') {
        const half = (rh - gap) / 2;
        keys.push({ x: x + gap / 2, y: y + half + gap, w: u - gap, h: half });
        keys.push({ x: x + u + gap / 2, y: y + gap / 2, w: u - gap, h: half - gap / 4 });
        keys.push({ x: x + u + gap / 2, y: y + half + gap, w: u - gap, h: half });
        keys.push({ x: x + u * 2 + gap / 2, y: y + half + gap, w: u - gap, h: half });
        x += u * 3;
        return;
      }
      const w = kk * u;
      keys.push({ x: x + gap / 2, y: y + gap / 2, w: w - gap, h: rh - gap });
      x += w;
    });
    y += rh;
  });

  // recessed keyboard well + a crisp dark gap around every key
  g.fillStyle = 'rgba(0,0,0,0.13)';
  roundRect(g, kx - u * 0.16, ky - u * 0.16, kw + u * 0.32, totalH + u * 0.32, u * 0.2);
  g.fill();
  g.fillStyle = 'rgba(0,0,0,0.55)';
  keys.forEach((r) => { roundRect(g, r.x - 3 * k, r.y - 3 * k, r.w + 6 * k, r.h + 6 * k, u * 0.12); g.fill(); });

  // speaker grilles either side of the keyboard
  g.fillStyle = 'rgba(0,0,0,0.34)';
  [[cw * 0.035, cw * 0.1], [cw * 0.9, cw * 0.965]].forEach(([x0, x1]) => {
    for (let gy = ky; gy < ky + totalH; gy += 11 * k) {
      for (let gx = x0; gx < x1; gx += 11 * k) {
        g.beginPath(); g.arc(gx, gy, 2.4 * k, 0, Math.PI * 2); g.fill();
      }
    }
  });

  // trackpad
  const tw = cw * 0.4;
  const th = ch * 0.33;
  const tx = (cw - tw) / 2;
  const ty = ky + totalH + ch * 0.07;
  g.fillStyle = 'rgba(0,0,0,0.04)';
  roundRect(g, tx, ty, tw, th, 26 * k); g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.22)';
  g.lineWidth = 3 * k; g.stroke();

  // front lip notch
  g.fillStyle = 'rgba(0,0,0,0.14)';
  roundRect(g, cw / 2 - 90 * k, ch - 10 * k, 180 * k, 14 * k, 7 * k); g.fill();

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return { texture: t, keys, cw, ch };
}

function barTexture(pxW, pxH) {
  const c = document.createElement('canvas');
  c.width = pxW; c.height = pxH;
  const g = c.getContext('2d');
  g.fillStyle = '#eceef2';
  g.fillRect(0, 0, pxW, pxH);
  g.fillStyle = '#d9dce2';
  g.fillRect(0, pxH - 2, pxW, 2);
  const r = pxH * 0.13;
  ['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath(); g.arc(pxH * 0.62 + i * r * 3.1, pxH / 2, r, 0, Math.PI * 2); g.fill();
  });
  const uw = pxW * 0.36;
  const uh = pxH * 0.6;
  const ux = (pxW - uw) / 2;
  const uy = (pxH - uh) / 2;
  g.fillStyle = '#ffffff';
  roundRect(g, ux, uy, uw, uh, uh / 2); g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.06)'; g.lineWidth = 2; g.stroke();
  const fs = Math.round(uh * 0.5);
  g.font = `600 ${fs}px Archivo, "Segoe UI", Arial, sans-serif`;
  const tw = g.measureText(SITE).width;
  const lockW = fs * 0.75;
  const startX = pxW / 2 - (tw + lockW + fs * 0.4) / 2;
  // lock icon
  g.strokeStyle = '#5b6170'; g.fillStyle = '#5b6170'; g.lineWidth = Math.max(2, fs * 0.11);
  const lx = startX;
  const ly = pxH / 2;
  g.beginPath(); g.arc(lx + lockW / 2, ly - fs * 0.12, lockW * 0.28, Math.PI, 0); g.stroke();
  roundRect(g, lx + lockW * 0.12, ly - fs * 0.12, lockW * 0.76, fs * 0.5, 3); g.fill();
  g.fillStyle = '#2f3440';
  g.textBaseline = 'middle';
  g.fillText(SITE, startX + lockW + fs * 0.4, pxH / 2 + 1);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function logoTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = '800 168px Archivo, "Arial Black", Arial, sans-serif';
  g.fillText('AGF', 256, 262);
  g.lineWidth = 10;
  g.strokeStyle = '#ffffff';
  g.beginPath(); g.arc(256, 256, 200, 0, Math.PI * 2); g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function glareTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0.0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.42, 'rgba(255,255,255,0)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.62, 'rgba(255,255,255,0)');
  grad.addColorStop(1.0, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  return new THREE.CanvasTexture(c);
}

/* ---------- studio lighting ----------
   A small "photo studio" rendered into the environment map: a big overhead softbox,
   a key strip on the left, a cool rim strip behind on the right and a soft front fill,
   all inside a mid-grey room. Aluminium picks up crisp highlights and darker sides,
   so the laptop separates from the light card behind it. */
function studioEnvironment(renderer) {
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x5d6066);
  const geo = new THREE.PlaneGeometry(1, 1);
  const O = new THREE.Vector3(0, 0, 0);
  const box = (w, h, x, y, z, power, color = 0xffffff) => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide }));
    m.scale.set(w, h, 1);
    m.position.set(x, y, z);
    m.lookAt(O);
    env.add(m);
  };
  box(18, 9, 0, 5.5, -9, 2.3);                // wide softbox behind/above — what the deck reflects
  box(10, 6, 0, 9, 0.5, 2.0);                 // overhead softbox
  box(2.4, 9, -8, 3, 3, 2.6, 0xfff4e8);       // warm key strip, left
  box(1.8, 9, 8, 3.5, -3, 2.2, 0xe2eaff);     // cool rim strip, right
  box(14, 4, 0, 2, 10, 1.25);                 // front fill (camera side)
  box(30, 30, 0, -8, 0, 0.18);                // dark floor: keeps the lower edges defined
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.035).texture;
  pmrem.dispose();
  geo.dispose();
  return tex;
}

/* ---------- main ---------- */
export async function createLaptop(host, { reduced = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'laptop3d__canvas';
  canvas.setAttribute('aria-label', 'Interactive 3D laptop showing the Laju Order website — drag to rotate');
  canvas.setAttribute('role', 'img');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);

  const loader = new THREE.TextureLoader();
  const [screenTex, headerTex] = await Promise.all([
    loader.loadAsync(IMG + 'screen.webp'),
    loader.loadAsync(IMG + 'header.webp')
  ]);
  if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  [screenTex, headerTex].forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
  });

  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  scene.environmentIntensity = 1.0;

  // direct lights add the specular "glints" on edges and key caps
  const keyLight = new THREE.DirectionalLight(0xfff4e8, 1.6);
  keyLight.position.set(-4, 7, 5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xdfe8ff, 1.3);
  rimLight.position.set(5, 4, -6);
  scene.add(rimLight);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3b40, 0.35));

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const target = new THREE.Vector3(0, 0.82, 0);

  /* materials */
  const alu = new THREE.MeshPhysicalMaterial({ color: 0xc9ccd3, metalness: 0.92, roughness: 0.3, clearcoat: 0.25, clearcoatRoughness: 0.22 });
  const aluEdge = new THREE.MeshStandardMaterial({ color: 0x8e9299, metalness: 1, roughness: 0.38 });
  const glassBlack = new THREE.MeshPhysicalMaterial({ color: 0x050506, metalness: 0, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08 });

  /* hierarchy: root (float) → laptop (rotation) → model (offset so it spins around its visual centre) */
  const root = new THREE.Group();
  const laptop = new THREE.Group();
  const model = new THREE.Group();
  model.position.z = 0.32;
  laptop.add(model);
  root.add(laptop);
  scene.add(root);

  // base
  const base = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, 0.04), alu);
  model.add(base);
  const deckData = deckTexture();
  deckData.texture.anisotropy = maxAniso;
  const deck = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.08, D - 0.08),
    new THREE.MeshStandardMaterial({ map: deckData.texture, transparent: true, metalness: 0.6, roughness: 0.4 })
  );
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = H / 2 + 0.0015;
  model.add(deck);

  // real 3D key caps (one instanced mesh) so the keyboard stays crisp from every angle
  const KEY_H = 0.014;
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, metalness: 0, roughness: 0.62, envMapIntensity: 0.55 });
  const keyGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.16);
  const keyMesh = new THREE.InstancedMesh(keyGeo, keyMat, deckData.keys.length);
  const sx = (W - 0.08) / deckData.cw;
  const sz = (D - 0.08) / deckData.ch;
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  deckData.keys.forEach((r, i) => {
    const pos = new THREE.Vector3((r.x + r.w / 2) * sx - (W - 0.08) / 2, H / 2 + 0.002 + KEY_H / 2, (r.y + r.h / 2) * sz - (D - 0.08) / 2);
    m4.compose(pos, q, new THREE.Vector3(r.w * sx, KEY_H, r.h * sz));
    keyMesh.setMatrixAt(i, m4);
  });
  keyMesh.instanceMatrix.needsUpdate = true;
  model.add(keyMesh);

  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, W - 0.6, 24), aluEdge);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, H / 2, -D / 2 + 0.05);
  model.add(hinge);

  // lid
  const lid = new THREE.Group();
  lid.position.set(0, H / 2, -D / 2 + 0.06);
  lid.rotation.x = reduced ? LID_OPEN : LID_CLOSED;
  model.add(lid);

  const shell = new THREE.Mesh(new RoundedBoxGeometry(W, LH, LT, 6, 0.02), alu);
  shell.position.set(0, LH / 2, -LT / 2);
  lid.add(shell);

  const bezel = new THREE.Mesh(new THREE.ShapeGeometry(roundedRectShape(W - 0.05, LH - 0.05, 0.08), 8), glassBlack);
  bezel.position.set(0, LH / 2, 0.0015);
  lid.add(bezel);

  const cam = new THREE.Mesh(new THREE.CircleGeometry(0.016, 20), new THREE.MeshBasicMaterial({ color: 0x1b1d24 }));
  cam.position.set(0, LH - 0.065, 0.0025);
  lid.add(cam);

  // display: browser bar + fixed site header + scrolling page
  const screen = new THREE.Group();
  screen.position.set(0, LH / 2 + 0.01, 0.003);
  lid.add(screen);
  const top = SH / 2;
  const contentH = SH - BAR;

  const barPxW = 2304;
  const bar = new THREE.Mesh(
    new THREE.PlaneGeometry(SW, BAR),
    new THREE.MeshBasicMaterial({ map: barTexture(barPxW, Math.round(barPxW * BAR / SW)), toneMapped: false })
  );
  bar.position.set(0, top - BAR / 2, 0.0004);
  screen.add(bar);

  const img = screenTex.image;
  const visiblePx = img.width * (contentH / SW);
  const rep = Math.min(1, visiblePx / img.height);
  screenTex.repeat.set(1, rep);
  screenTex.offset.set(0, 1 - rep);
  const page = new THREE.Mesh(new THREE.PlaneGeometry(SW, contentH), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  page.position.set(0, top - BAR - contentH / 2, 0);
  screen.add(page);

  const headerH = SW * (headerTex.image.height / headerTex.image.width);
  const header = new THREE.Mesh(new THREE.PlaneGeometry(SW, headerH), new THREE.MeshBasicMaterial({ map: headerTex, toneMapped: false }));
  header.position.set(0, top - BAR - headerH / 2, 0.0008);
  screen.add(header);

  // power-on curtain and glass glare
  const curtain = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ color: 0x050506, transparent: true, opacity: reduced ? 0 : 1, toneMapped: false }));
  curtain.position.z = 0.0012;
  screen.add(curtain);
  const glareTex = glareTexture();
  const glare = new THREE.Mesh(
    new THREE.PlaneGeometry(SW, SH),
    new THREE.MeshBasicMaterial({ map: glareTex, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  );
  glare.position.z = 0.0016;
  screen.add(glare);

  // mirror-finish monogram on the back of the lid
  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.5),
    new THREE.MeshStandardMaterial({ map: logoTexture(), transparent: true, alphaTest: 0.4, metalness: 1, roughness: 0.08, color: 0xf2f3f6 })
  );
  logo.rotation.y = Math.PI;
  logo.position.set(0, LH / 2, -LT - 0.0012);
  lid.add(logo);

  /* ---------- layout ---------- */
  const fit = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // pull back until the laptop fits both the width and the height of its box
    target.set(0, 0.82, 0);
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const tanH = tanV * camera.aspect;
    const NEED_W = 4.15; // base width incl. perspective of the near edge + breathing room
    const NEED_H = 3.0;  // lid top to base front, as seen from the camera
    const dist = Math.max(NEED_W / (2 * tanH), NEED_H / (2 * tanV));
    const elev = THREE.MathUtils.degToRad(17);
    camera.position.set(target.x, target.y + dist * Math.sin(elev), dist * Math.cos(elev));
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  };
  fit();
  new ResizeObserver(fit).observe(host);

  /* ---------- interaction ---------- */
  // the laptop stays still; dragging rotates it and letting go springs it straight back
  let yaw = BASE_YAW;
  let pitch = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
    host.classList.add('is-grabbing', 'is-touched');
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    yaw += dx * 0.0085;
    if (e.pointerType === 'mouse') pitch = clamp(pitch + dy * 0.004, -0.3, 0.42);
  });
  const end = () => {
    dragging = false;
    host.classList.remove('is-grabbing');
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('lostpointercapture', end);

  /* ---------- lid opening ---------- */
  let openStart = reduced ? 0 : -1;
  let screenOnAt = reduced ? 0 : -1;
  const open = () => { if (openStart < 0) openStart = performance.now(); };

  /* ---------- loop ---------- */
  let running = false;
  let raf = 0;
  let prev = performance.now();

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;

    // lid
    if (openStart >= 0 && !reduced) {
      const p = clamp((now - openStart) / 1700, 0, 1);
      lid.rotation.x = LID_CLOSED + (LID_OPEN - LID_CLOSED) * easeOutBack(p);
      if (p > 0.35 && screenOnAt < 0) screenOnAt = now;
    }
    if (screenOnAt >= 0 && curtain.material.opacity > 0) {
      curtain.material.opacity = clamp(1 - (now - screenOnAt) / 700, 0, 1);
    }

    // released: return to the front view right away (shortest way round)
    if (!dragging) {
      let goal = BASE_YAW;
      while (yaw - goal > Math.PI) goal += Math.PI * 2;
      while (goal - yaw > Math.PI) goal -= Math.PI * 2;
      const k = reduced ? 1 : 1 - Math.exp(-dt * 9);
      yaw += (goal - yaw) * k;
      pitch += (0 - pitch) * k;
    }
    laptop.rotation.set(pitch, yaw, 0);

    // the page inside the browser scrolls down and back up
    if (screenOnAt >= 0 && !reduced) {
      const cyc = 24;
      const t = ((now - screenOnAt) / 1000 % cyc) / cyc;
      let f = 0;
      if (t < 0.1) f = 0;
      else if (t < 0.5) f = easeInOut((t - 0.1) / 0.4);
      else if (t < 0.6) f = 1;
      else if (t < 0.92) f = 1 - easeInOut((t - 0.6) / 0.32);
      screenTex.offset.y = (1 - rep) * (1 - f);
    }
    glareTex.offset.x = clamp(-yaw * 0.25, -0.5, 0.5);

    renderer.render(scene, camera);
  };

  const start = () => { if (running) return; running = true; prev = performance.now(); raf = requestAnimationFrame(frame); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  let inView = false;
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) { start(); if (e.intersectionRatio > 0.3) open(); } else stop();
  }, { threshold: [0, 0.3, 0.6] }).observe(host);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else if (inView) start();
  });

  host.appendChild(canvas);
  renderer.render(scene, camera);
  requestAnimationFrame(() => host.classList.add('is-ready'));

  return { open, start, stop };
}
