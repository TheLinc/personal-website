// The hero bust: a stone bust in neon shutter shades. Scroll turns it to face you, the mouse swings it
// side to side, and hovering the head floats spheres with the tools I think about.

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { TessellateModifier } from "three/examples/jsm/modifiers/TessellateModifier.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { approach, drawOrder, followsPointer, isHead, needsRaycast, scrollProgress, thoughtPos, toNdc, yaw, isSettled } from "@/lib/bustMotion";
import { bendPoint, frontOutline, insidePoly, lensOpening, restOffset, rowExtent, slatBars } from "@/lib/shades";

const NEON = "#c4ab12"; // darker than it reads: lit faces land near #f5e12a without clipping
const EYE_Y = 0.45;
const CLEARANCE = 0.012; // nearest gap between frame and face
const THOUGHTS: [string, [number, number, number]][] = [
  ["/assets/bust/icons/claude.svg", [-0.3, 0.9, 0.2]],
  ["/assets/bust/icons/vercel.svg", [-0.1, 1.04, 0.18]],
  ["/assets/icons/react.png", [0.12, 1.06, 0.16]],
  ["/assets/icons/ts.png", [0.31, 0.92, 0.2]],
  ["/assets/icons/sql.png", [-0.2, 0.76, 0.32]],
  ["/assets/icons/aws.png", [0.21, 0.77, 0.32]],
];

// Wrap flat geometry around a cylinder. Long triangles are split first: bending only moves vertices, so a long
// triangle would stay a straight chord and sink behind the curve (that showed as a slot over the bridge).
// Normals are turned with the surface rather than recomputed, so the caps still shade smoothly.
const tessellate = new TessellateModifier(0.012, 8);
function bend(flat: THREE.BufferGeometry, R: number) {
  const geo = tessellate.modify(flat.index ? flat.toNonIndexed() : flat);
  const p = geo.attributes.position, n = geo.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    const a = p.getX(i) / R;
    const [x, z] = bendPoint(p.getX(i), p.getZ(i), R);
    p.setXYZ(i, x, p.getY(i), z);
    const nx = n.getX(i), nz = n.getZ(i);
    n.setXYZ(i, nx * Math.cos(a) + nz * Math.sin(a), n.getY(i), -nx * Math.sin(a) + nz * Math.cos(a));
  }
  return geo;
}

// Shutter shades: one moulded front (brow bar, two lenses of slats, nose arch) wrapped gently around the
// face, plus two flat arms hinged near the top of each end. Matte plastic, like the real party glasses.
const WRAP = 0.5;
const SCALE = 0.85; // front width ~0.63, about temple to temple
const FRONT_DEPTH = 0.034;
const ARM_LEN = 1.0;
const ARM_TILT = 0.05; // nearly level; the tail bends down behind the ear instead
function buildShades(env: THREE.Texture) {
  const g = new THREE.Group();
  g.scale.setScalar(SCALE);
  const mat = new THREE.MeshPhysicalMaterial({
    color: NEON, roughness: 0.42, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.35, envMap: env, envMapIntensity: 0.9, // all-round fill reaches undersides
    side: THREE.DoubleSide, // bending turns the far rim edge-on; single-sided it vanished at steep angles
    emissive: NEON, emissiveIntensity: 0.05,
  });
  // The filmic curve bleaches yellow to cream, so the glasses skip it; the base is pre-darkened so nothing clips.
  mat.toneMapped = false;
  const v2 = (p: { x: number; y: number }) => new THREE.Vector2(p.x, p.y);
  const add = (geo: THREE.BufferGeometry, z: number) => {
    geo.translate(0, 0, z);
    const m = new THREE.Mesh(bend(geo, WRAP), mat);
    m.castShadow = true;
    g.add(m);
  };
  // Densify a closed outline so it bends smoothly.
  const dense = (pts: THREE.Vector2[]) => pts.flatMap((p, i) => {
    const q = pts[(i + 1) % pts.length], n = Math.max(1, Math.ceil(p.distanceTo(q) / 0.01));
    return Array.from({ length: n }, (_, k) => p.clone().lerp(q, k / n));
  });
  const pill = (x0: number, x1: number, y0: number, y1: number) => {
    const r = (y1 - y0) / 2, cy = (y0 + y1) / 2, s = new THREE.Shape();
    s.absarc(x1 - r, cy, r, -Math.PI / 2, Math.PI / 2, false);
    s.absarc(x0 + r, cy, r, Math.PI / 2, (3 * Math.PI) / 2, false);
    return dense(s.getPoints(8));
  };

  // Frame: brow bar, rims and nose arch in one piece with both lens openings cut out, edges well rounded.
  const front = new THREE.Shape(frontOutline().map(v2));
  for (const sx of [1, -1] as const) front.holes.push(new THREE.Path(lensOpening(sx).map(v2)));
  add(new THREE.ExtrudeGeometry(front, { depth: FRONT_DEPTH, bevelEnabled: true, bevelThickness: 0.011, bevelSize: 0.006, bevelSegments: 4 }), -FRONT_DEPTH);

  for (const sx of [1, -1] as const) {
    const opening = lensOpening(sx);
    // Five chunky slats; the gap under the last one stays open and follows the lens curve.
    const bars = slatBars(opening, 5, 0.65);
    // Slats: rounded (capsule-like) bars, ends buried in the rim, set a hair behind the frame's face.
    for (const b of bars) {
      const bs = (b.y1 - b.y0) * 0.3;
      const shape = new THREE.Shape(pill(b.x0 + bs, b.x1 - bs, b.y0 + bs, b.y1 - bs));
      add(new THREE.ExtrudeGeometry(shape, { depth: FRONT_DEPTH * 0.6, bevelEnabled: true, bevelThickness: 0.007, bevelSize: bs, bevelSegments: 4 }), -FRONT_DEPTH * 0.8);
    }
  }

  // Arms: hinge tucked behind each frame end a third of the way down, then a long tapered arm angled down,
  // running along the side of the head into the hair over the ear.
  // Side view of an arm (x = back along it, y = up): straight, flared at the hinge and tapering toward a rounded tip.
  // Built at length ARM_LEN and scaled to fit each side.
  const profile = new THREE.Shape();
  const half = (x: number) => (x < 0.08 ? 0.02 - (0.005 * x) / 0.08 : 0.015 - (0.003 * (x - 0.08)) / (ARM_LEN - 0.08));
  const xs = Array.from({ length: 41 }, (_, i) => (ARM_LEN * i) / 40);
  profile.moveTo(0, -half(0));
  xs.forEach((x) => profile.lineTo(x, -half(x)));
  profile.lineTo(ARM_LEN + 0.008, 0); // rounded-ish tip
  [...xs].reverse().forEach((x) => profile.lineTo(x, half(x)));
  profile.lineTo(0, -half(0));
  for (const sx of [1, -1]) {
    const [ex, ez] = bendPoint(sx * 0.35, -FRONT_DEPTH, WRAP);
    const hinge = new THREE.Mesh(new RoundedBoxGeometry(0.016, 0.046, 0.04, 4, 0.0075), mat); // small rounded nub, covers the arm at the joint
    hinge.position.set(ex - sx * 0.006, 0.028, ez - 0.02);
    const armGeo = new THREE.ExtrudeGeometry(profile, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2 });
    armGeo.translate(0, 0, -0.008);
    armGeo.rotateY(Math.PI / 2); // profile x → -z (backwards), extrusion → x
    const arm = new THREE.Mesh(armGeo, mat);
    arm.position.set(ex - sx * 0.002, 0.028, ez - 0.03);
    arm.rotation.set(-ARM_TILT, 0, 0, "YXZ"); // yaw is set once the glasses are seated (aimArms)
    arm.userData.arm = sx;
    hinge.userData.hinge = sx;
    for (const m of [hinge, arm]) { m.castShadow = true; g.add(m); }
  }
  return g;
}

// Arms run nearly straight back (at most ~5° outward, so they hide behind the head from the front). Where the
// temple bulges, the hinge is pushed out instead of splaying the arm; then the arm runs into the curls and ends
// a little way inside them, the way real arms disappear under thick hair.
const ARM_REACH = 0.48; // world units back from the hinge, to about the top of the ear
const ARM_CLEAR = 0.012;
const MAX_SPLAY = Math.tan((5 * Math.PI) / 180);
function aimArms(shades: THREE.Object3D, head: THREE.Object3D) {
  const ray = new THREE.Raycaster();
  const parts = new Map<number, { arm?: THREE.Object3D; hinge?: THREE.Object3D }>();
  shades.traverse((o) => {
    const sx = (o.userData.arm ?? o.userData.hinge) as number | undefined;
    if (!sx) return;
    const e = parts.get(sx) ?? {};
    if (o.userData.arm) e.arm = o; else e.hinge = o;
    parts.set(sx, e);
  });
  for (const [sx, { arm, hinge }] of parts) {
    if (!arm) continue;
    const s = arm.position.clone();
    const reach = ARM_REACH / SCALE;
    const need: { d: number; n: number }[] = []; // lateral clearance needed at distance d back (temple only)
    for (let k = 1; k <= 4; k++) {
      const d = (reach * 0.45 * k) / 4;
      const p = shades.localToWorld(new THREE.Vector3(s.x, s.y - Math.sin(ARM_TILT) * d, s.z - d));
      ray.set(new THREE.Vector3(sx * 3, p.y, p.z), new THREE.Vector3(-sx, 0, 0));
      const hit = ray.intersectObject(head, true)[0];
      if (hit) need.push({ d, n: sx * (shades.worldToLocal(hit.point.clone()).x - s.x) + ARM_CLEAR / SCALE });
    }
    const splay = Math.min(MAX_SPLAY, Math.max(0, ...need.map((q) => q.n / q.d)));
    const push = Math.max(0, ...need.map((q) => q.n - splay * q.d));
    arm.position.x += sx * push;
    if (hinge) {
      // Stretch the hinge block outward so it joins the frame end to the pushed-out arm as one piece.
      const w = 0.016;
      hinge.scale.x = (w + push) / w;
      hinge.position.x += (sx * push) / 2;
    }
    arm.rotation.y = Math.atan2(-sx * splay, 1);
    // Run on into the curls and stop shortly inside them.
    arm.updateMatrixWorld(true);
    const start = arm.getWorldPosition(new THREE.Vector3());
    const dir = new THREE.Vector3(0, 0, -1).transformDirection(arm.matrixWorld);
    const from = reach * 0.45 * SCALE;
    ray.set(start.clone().addScaledVector(dir, from), dir);
    ray.far = reach * SCALE;
    const enter = ray.intersectObject(head, true)[0];
    ray.far = Infinity;
    const len = enter ? from + enter.distance + 0.014 : reach * SCALE;
    arm.scale.z = len / SCALE / ARM_LEN;
  }
}

export function createBustScene(canvas: HTMLCanvasElement, opts: { onReady(): void; onLost(): void }) {
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  r.setPixelRatio(Math.min(Math.max(devicePixelRatio, 1.5), 2)); // a little supersampling keeps thin slats clean
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFShadowMap; // VSM bled light into a pale halo around the lens
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(r);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  cam.position.set(0, 0.05, 5.5);
  scene.add(new THREE.HemisphereLight(0xfff8ec, 0x6e5f49, 0.7));
  const key = new THREE.DirectionalLight(0xfff3e2, 3.4);
  key.position.set(-2.5, 3.5, 4);
  key.castShadow = true; // the glasses throw soft slatted shadows onto the face
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -1.2, right: 1.2, top: 1.6, bottom: -0.8, near: 1, far: 12 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 6;
  key.shadow.intensity = 0.55; // a soft hint of contact, not a grey patch
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(3, 0, 3);
  const rim = new THREE.DirectionalLight(0xfff0dd, 1);
  rim.position.set(3, 3, -3);
  scene.add(key, fill, rim);

  const rig = new THREE.Group();
  scene.add(rig);

  const tl = new THREE.TextureLoader();
  const thoughts = THOUGHTS.map(([src]) => {
    const b = new THREE.Group();
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 32, 16),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1, envMap: env, envMapIntensity: 1.2, depthTest: false, transparent: true }),
    );
    const tex = tl.load(src);
    tex.colorSpace = THREE.SRGBColorSpace;
    const logo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    logo.scale.setScalar(0.085 * 1.25);
    b.add(ball, logo);
    b.visible = false;
    rig.add(b);
    return { b, ball, logo, mats: [ball.material, logo.material] };
  });

  let bust: THREE.Object3D | null = null;
  const brain = new THREE.Box3(); // the head (chin up), rig-local; rays that miss it skip the triangle test
  const draco = new DRACOLoader().setDecoderPath("/draco/");
  new GLTFLoader().setDRACOLoader(draco).load("/assets/bust/bust.glb", (gltf) => {
    const root = new THREE.Group();
    gltf.scene.rotation.y = -Math.PI / 2;
    root.add(gltf.scene);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const k = 2.2 / size.y;
    root.scale.setScalar(k);
    root.position.set(-c.x * k, -c.y * k, -c.z * k);
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const m = o.material as THREE.MeshStandardMaterial;
      Object.assign(m, { roughness: 0.85, metalness: 0, envMap: env, envMapIntensity: 0.2 });
      o.receiveShadow = true;
      if (m.map) m.map.anisotropy = 8;
    });
    rig.add(root);
    const turned = rig.rotation.y; // measure the face and the brain box with the bust facing forward
    rig.rotation.y = 0;
    rig.updateMatrixWorld(true);
    const shades = buildShades(env);
    shades.position.set(0, EYE_Y, 0);
    shades.rotation.x = 0.15; // ~9° pantoscopic tilt: top leans out, bottom rests toward the cheeks
    rig.add(shades);
    shades.updateMatrixWorld(true);
    // Rest the frame as close to the face as it goes without touching: ray-test the face behind points on the frame.
    const down = new THREE.Raycaster();
    // Sample a grid over the whole front, not just its edge: the brow ridge between the lenses sticks out furthest.
    const outline = frontOutline(), oy = outline.map((p) => p.y);
    const grid: { x: number; y: number }[] = [];
    for (let i = 0; i <= 8; i++) {
      const y = Math.min(...oy) + 0.004 + ((Math.max(...oy) - Math.min(...oy) - 0.008) * i) / 8;
      const e = rowExtent(outline, y);
      if (e) for (let j = 0; j <= 16; j++) grid.push({ x: e[0] + 0.004 + ((e[1] - e[0] - 0.008) * j) / 16, y });
    }
    {
      const onFrame = grid.filter((p) => insidePoly(p, outline)); // not the gap under the nose arch
      grid.length = 0;
      grid.push(...onFrame);
    }
    const samples = grid.map((p) => {
      const [x, z] = bendPoint(p.x, -FRONT_DEPTH - 0.006, WRAP);
      const w = shades.localToWorld(new THREE.Vector3(x, p.y, z)); // includes SCALE and tilt
      down.set(new THREE.Vector3(w.x, w.y, 5), new THREE.Vector3(0, 0, -1));
      const hit = down.intersectObject(root, true)[0];
      return { gz: w.z, fz: hit ? hit.point.z : null };
    });
    shades.position.z = restOffset(samples, CLEARANCE);
    shades.updateMatrixWorld(true);
    aimArms(shades, root);
    brain.setFromObject(root);
    brain.min.y = 0.12;
    rig.rotation.y = turned;
    bust = root;
    draco.dispose();
    opts.onReady();
    wake();
  }, undefined, () => draco.dispose());

  let raf = 0;
  let active = false;
  // tick is a const declared below; wake only runs from events, after it exists.
  const wake = () => {
    if (active && !raf) raf = requestAnimationFrame(tick);
  };

  // Only a mouse steers the bust; touch is scrolling the page. Client coords are kept, not NDC, so a scroll
  // under a resting mouse still updates what it is over.
  const pointer = { mx: 0, x: NaN, y: NaN };
  const onMove = (e: PointerEvent) => {
    if (!followsPointer(e.pointerType)) return;
    pointer.mx = (e.clientX / innerWidth) * 2 - 1;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    wake();
  };
  const onLeave = () => {
    pointer.x = pointer.y = NaN;
    wake();
  };
  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("scroll", wake, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  addEventListener("blur", onLeave);
  const onLost = (e: Event) => {
    e.preventDefault();
    opts.onLost();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    r.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    wake();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const ray = new THREE.Raycaster();
  const tmp = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  const box = new THREE.Box3();
  const last = { x: NaN, y: NaN, yaw: NaN };
  let over = 0;
  const cur = { p: scrollProgress(scrollY), mx: 0, hover: 0 };
  const tick = () => {
    const pTo = scrollProgress(scrollY);
    cur.p = approach(cur.p, pTo, 0.14);
    cur.mx = approach(cur.mx, pointer.mx, 0.06);
    rig.rotation.y = yaw(cur.p, cur.mx);
    const look = { x: pointer.x, y: pointer.y + scrollY, yaw: rig.rotation.y };
    if (bust && needsRaycast(last, look)) {
      Object.assign(last, look);
      over = 0;
      if (!Number.isNaN(pointer.x)) {
        const [nx, ny] = toNdc(pointer.x, pointer.y, canvas.getBoundingClientRect());
        ray.setFromCamera(ndc.set(nx, ny), cam);
        rig.updateMatrixWorld();
        if (ray.ray.intersectsBox(box.copy(brain).applyMatrix4(rig.matrixWorld))) {
          const h = ray.intersectObject(bust, true)[0];
          if (h && isHead(rig.worldToLocal(h.point.clone()).y)) over = 1;
        }
      }
    }
    cur.hover = approach(cur.hover, over, 0.09);
    const t = performance.now() / 1000;
    thoughts.forEach(({ b, mats }, i) => {
      const q = thoughtPos(THOUGHTS[i][1], cur.hover, i, t);
      b.position.set(q.x, q.y, q.z);
      b.scale.setScalar(Math.max(0.001, q.s));
      mats.forEach((m) => (m.opacity = q.s));
      b.visible = q.s > 0.01;
    });
    // Bubbles ignore depth (they float "in" the head), so draw them back to front, each with its own logo on
    // top of it: a nearer bubble then covers both the bubble and the logo behind it.
    const view = cam.matrixWorldInverse;
    rig.updateMatrixWorld();
    const ranks = drawOrder(thoughts.map(({ b }) => b.getWorldPosition(tmp).applyMatrix4(view).z));
    thoughts.forEach(({ ball, logo }, i) => {
      ball.renderOrder = 10 + 2 * ranks[i];
      logo.renderOrder = 11 + 2 * ranks[i];
    });
    r.render(scene, cam);
    // Stop drawing once nothing is moving; the listeners above wake it again.
    raf = bust && isSettled({ p: cur.p, pTo, mx: cur.mx, mxTo: pointer.mx, hover: cur.hover, over }) ? 0 : requestAnimationFrame(tick);
  };

  return {
    setActive(on: boolean) {
      active = on;
      wake();
      if (!on && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", wake);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      removeEventListener("blur", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      ro.disconnect();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Sprite) {
          o.geometry.dispose();
          const m = o.material as THREE.Material & { map?: THREE.Texture | null };
          m.map?.dispose();
          m.dispose();
        }
      });
      env.dispose();
      pmrem.dispose();
      r.dispose();
    },
  };
}
