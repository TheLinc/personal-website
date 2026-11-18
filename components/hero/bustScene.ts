// The hero bust: a stone bust in neon shutter shades. Scroll turns it to face you, the mouse swings it
// side to side, and hovering the top of the head floats spheres with the tools I think about.

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { approach, followsPointer, isBrain, needsRaycast, scrollProgress, thoughtPos, toNdc, yaw } from "@/lib/bustMotion";
import { bendPoint, LENS, rowExtent } from "@/lib/shades";

const NEON = "#f2e21b";
const EYE_Y = 0.45;
const GAP = 0.05; // shades sit this far in front of the face
const THOUGHTS: [string, [number, number, number]][] = [
  ["/assets/bust/icons/claude.svg", [-0.3, 0.9, 0.2]],
  ["/assets/bust/icons/vercel.svg", [-0.1, 1.04, 0.18]],
  ["/assets/icons/react.png", [0.12, 1.06, 0.16]],
  ["/assets/icons/ts.png", [0.31, 0.92, 0.2]],
  ["/assets/icons/sql.png", [-0.2, 0.76, 0.32]],
  ["/assets/icons/aws.png", [0.21, 0.77, 0.32]],
];

function bend(geo: THREE.BufferGeometry, R: number) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const [x, z] = bendPoint(p.getX(i), p.getZ(i), R);
    p.setX(i, x);
    p.setZ(i, z);
  }
  geo.computeVertexNormals();
  return geo;
}

function buildShades(env: THREE.Texture) {
  const g = new THREE.Group();
  const R = 0.38, MID = 0.045, T = 0.026, SLATS = 5, S = 1.05;
  const mat = new THREE.MeshStandardMaterial({ color: NEON, roughness: 0.55, metalness: 0, envMap: env, envMapIntensity: 0.3 });
  for (const sx of [-1, 1]) {
    const v = LENS.map(([x, y]) => new THREE.Vector2(sx * (MID / 2 + x * S), y * S));
    const outer = new THREE.Shape();
    outer.moveTo(v[0].x, v[0].y);
    outer.splineThru([...v.slice(1), v[0]]);
    const op = outer.getPoints(80);
    const c = op.reduce((a, q) => a.add(q.clone()), new THREE.Vector2()).divideScalar(op.length);
    const sz = new THREE.Box2().setFromPoints(op).getSize(new THREE.Vector2());
    const kx = 1 - (2 * T) / sz.x, ky = 1 - (2 * T) / sz.y;
    const hole = op.map((q) => new THREE.Vector2(c.x + (q.x - c.x) * kx, c.y + (q.y - c.y) * ky));
    const ring = new THREE.Shape(op);
    ring.holes.push(new THREE.Path(hole));
    g.add(new THREE.Mesh(bend(new THREE.ExtrudeGeometry(ring, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.004, bevelSegments: 2, curveSegments: 4 }), R), mat));
    const hb = new THREE.Box2().setFromPoints(hole);
    for (let k = 1; k <= SLATS; k++) {
      const y = hb.min.y + ((hb.max.y - hb.min.y) * k) / (SLATS + 1);
      const ext = rowExtent(hole, y);
      if (!ext) continue;
      const [x0, x1] = [ext[0] - 0.006, ext[1] + 0.006];
      const slat = new THREE.BoxGeometry(x1 - x0, 0.012, 0.016, 16, 1, 1);
      slat.translate((x0 + x1) / 2, y, 0.014);
      g.add(new THREE.Mesh(bend(slat, R), mat));
    }
    const a = (sx * (MID / 2 + 0.29 * S)) / R;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.03, 0.44), mat);
    arm.position.set(Math.sin(a) * R, 0.06 * S, Math.cos(a) * R - R - 0.22);
    g.add(arm);
  }
  const bridge = new THREE.BoxGeometry(MID + 0.05, 0.03, 0.024, 8, 1, 1);
  bridge.translate(0, 0.07 * S, 0.01);
  g.add(new THREE.Mesh(bend(bridge, R), mat));
  return g;
}

export function createBustScene(canvas: HTMLCanvasElement, opts: { onReady(): void; onLost(): void }) {
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(r);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  cam.position.set(0, 0.05, 5.5);
  scene.add(new THREE.HemisphereLight(0xfff8ec, 0x6e5f49, 0.7));
  const key = new THREE.DirectionalLight(0xfff3e2, 3.4);
  key.position.set(-2.5, 3.5, 4);
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
    ball.renderOrder = 10;
    logo.renderOrder = 11;
    b.add(ball, logo);
    b.visible = false;
    rig.add(b);
    return { b, mats: [ball.material, logo.material] };
  });

  let bust: THREE.Object3D | null = null;
  const brain = new THREE.Box3(); // the top of the head, rig-local; rays that miss it skip the triangle test
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
      if (m.map) m.map.anisotropy = 8;
    });
    rig.add(root);
    const turned = rig.rotation.y; // measure the face and the brain box with the bust facing forward
    rig.rotation.y = 0;
    rig.updateMatrixWorld(true);
    const hit = new THREE.Raycaster(new THREE.Vector3(0, EYE_Y, 5), new THREE.Vector3(0, 0, -1)).intersectObject(root, true)[0];
    const shades = buildShades(env);
    shades.position.set(0, EYE_Y, (hit ? hit.point.z : 0.45) + GAP);
    rig.add(shades);
    brain.setFromObject(root);
    brain.min.y = 0.58;
    rig.rotation.y = turned;
    bust = root;
    draco.dispose();
    opts.onReady();
  }, undefined, () => draco.dispose());

  // Only a mouse steers the bust; touch is scrolling the page. Client coords are kept, not NDC, so a scroll
  // under a resting mouse still updates what it is over.
  const pointer = { mx: 0, x: NaN, y: NaN };
  const onMove = (e: PointerEvent) => {
    if (!followsPointer(e.pointerType)) return;
    pointer.mx = (e.clientX / innerWidth) * 2 - 1;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  };
  const onLeave = () => {
    pointer.x = pointer.y = NaN;
  };
  addEventListener("pointermove", onMove, { passive: true });
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
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const box = new THREE.Box3();
  const last = { x: NaN, y: NaN, yaw: NaN };
  let over = 0;
  const cur = { p: scrollProgress(scrollY), mx: 0, hover: 0 };
  let raf = 0;
  const tick = () => {
    cur.p = approach(cur.p, scrollProgress(scrollY), 0.14);
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
          if (h && isBrain(rig.worldToLocal(h.point.clone()).y)) over = 1;
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
    r.render(scene, cam);
    raf = requestAnimationFrame(tick);
  };

  return {
    setActive(on: boolean) {
      if (on && !raf) raf = requestAnimationFrame(tick);
      if (!on && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      removeEventListener("pointermove", onMove);
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
