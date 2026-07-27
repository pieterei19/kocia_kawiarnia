import * as THREE from "../lib/three/three.module.js";
import { createCatModel } from "./cat-model.js";

const ROOM_W = 5.2;
const ROOM_D = 2.7;

function softMat(color, opts = {}) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: opts.roughness ?? 0.6, clearcoat: opts.clearcoat ?? 0.15 });
}

const DECO_BUILDERS = {
  kulka: () => {
    const g = new THREE.Group();
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), softMat(0xe07a8c, { roughness: 0.8 }));
    g.add(ball);
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.012, 8, 24), softMat(0xc65a70, { roughness: 0.9 }));
      ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      g.add(ring);
    }
    g.position.y = 0.16;
    return g;
  },
  miska: () => {
    const g = new THREE.Group();
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.14, 24), softMat(0xf2f2f2, { roughness: 0.3, clearcoat: 0.5 }));
    g.add(bowl);
    const food = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 24), softMat(0xb5762f, { roughness: 0.9 }));
    food.position.y = 0.08;
    g.add(food);
    g.position.y = 0.07;
    return g;
  },
  poduszka: () => {
    const pillow = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 16), softMat(0xe8a8bc, { roughness: 0.85 }));
    pillow.scale.set(1.3, 0.45, 1.1);
    pillow.position.y = 0.13;
    return pillow;
  },
  "roślinka": () => {
    const g = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.18, 16), softMat(0xc97a4a, { roughness: 0.8 }));
    pot.position.y = 0.09;
    g.add(pot);
    const leafMat = softMat(0x5a9c5a, { roughness: 0.6 });
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.3, 8), leafMat);
      const a = (i / 5) * Math.PI * 2;
      leaf.position.set(Math.cos(a) * 0.05, 0.32, Math.sin(a) * 0.05);
      leaf.rotation.set(Math.sin(a) * 0.3, 0, Math.cos(a) * 0.3);
      g.add(leaf);
    }
    return g;
  },
  "pudełko": () => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.28, 0.4), softMat(0xd9a86a, { roughness: 0.75 }));
    box.position.y = 0.14;
    return box;
  },
  ryba: () => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), softMat(0xf0a94e, { roughness: 0.4, clearcoat: 0.5 }));
    body.scale.set(1.4, 0.9, 0.7);
    g.add(body);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.16, 8), softMat(0xe8823c, { roughness: 0.4 }));
    tail.rotation.z = Math.PI / 2;
    tail.position.x = -0.22;
    g.add(tail);
    g.position.y = 0.12;
    g.rotation.y = Math.PI / 2;
    return g;
  },
};

export function createPokojScene(canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
  camera.position.set(0, 1.75, 3.5);
  camera.lookAt(0, 0.35, -0.3);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const hemi = new THREE.HemisphereLight(0xfff3df, 0xb98a52, 0.6);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff1d8, 1.3);
  key.position.set(2, 4, 2.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfe0ff, 0.35);
  rim.position.set(-3, 2, -2);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_W, ROOM_D),
    softMat(0xc99a63, { roughness: 0.85, clearcoat: 0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(1.1, 40),
    softMat(0xe8c48a, { roughness: 0.9, clearcoat: 0 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.y = 0.002;
  rug.receiveShadow = true;
  scene.add(rug);

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_W, 1.7),
    softMat(0xf2e2c8, { roughness: 0.95, clearcoat: 0 })
  );
  wall.position.set(0, 0.85, -ROOM_D / 2);
  wall.receiveShadow = true;
  scene.add(wall);

  let cats = []; // { group, target: {x,z}, nextChange, speed }
  let decoGroup = new THREE.Group();
  scene.add(decoGroup);

  function randomFloorSpot(margin = 0.35) {
    return {
      x: (Math.random() - 0.5) * (ROOM_W - margin * 2),
      z: (Math.random() - 0.5) * (ROOM_D - margin * 2) * 0.6 + 0.3,
    };
  }

  function setCats(catColorKeys) {
    cats.forEach((c) => scene.remove(c.group));
    cats = catColorKeys.map((colorKey, i) => {
      const group = createCatModel(colorKey);
      group.scale.setScalar(0.55);
      const spot = randomFloorSpot();
      group.position.set(spot.x, 0, spot.z);
      scene.add(group);
      return {
        group,
        pos: { x: spot.x, z: spot.z },
        target: randomFloorSpot(),
        speed: 0.35 + Math.random() * 0.15,
        pauseUntil: performance.now() / 1000 + Math.random() * 3,
      };
    });
  }

  function setDecos(decoIds) {
    scene.remove(decoGroup);
    decoGroup = new THREE.Group();
    const n = decoIds.length;
    decoIds.forEach((id, i) => {
      const build = DECO_BUILDERS[id];
      if (!build) return;
      const item = build();
      const angle = (i / Math.max(n, 1)) * Math.PI - Math.PI / 2;
      const radius = ROOM_W * 0.36;
      item.position.x += Math.cos(angle) * radius;
      item.position.z += 0.55 + Math.sin(angle) * 0.35;
      item.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      decoGroup.add(item);
    });
    scene.add(decoGroup);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  }

  let running = true;
  const clock = new THREE.Clock();
  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const now = performance.now() / 1000;

    cats.forEach((c) => {
      const dx = c.target.x - c.pos.x;
      const dz = c.target.z - c.pos.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 0.05) {
        if (now > c.pauseUntil) {
          c.target = randomFloorSpot();
          c.pauseUntil = now + 1.5 + Math.random() * 2.5;
        }
      } else if (now > c.pauseUntil - 5) {
        const step = Math.min(dist, c.speed * dt);
        c.pos.x += (dx / dist) * step;
        c.pos.z += (dz / dist) * step;
        const targetYaw = Math.atan2(dx, dz);
        c.group.rotation.y += (targetYaw - c.group.rotation.y) * Math.min(1, dt * 3);
      }
      c.group.position.set(c.pos.x, Math.sin(now * 3 + c.pos.x) * 0.015, c.pos.z);
    });

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", resize);
  resize();
  animate();

  return {
    setCats,
    setDecos,
    resize,
    dispose() {
      running = false;
      window.removeEventListener("resize", resize);
      renderer.dispose();
    },
  };
}
