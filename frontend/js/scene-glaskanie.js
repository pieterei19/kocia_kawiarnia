import * as THREE from "../lib/three/three.module.js";
import { createCatModel } from "./cat-model.js";

export function createGlaskanieScene(canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
  camera.position.set(0, 0.55, 5.2);
  camera.lookAt(0, 0.05, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // Warm three-point lighting, tuned for a soft "chibi render" look.
  const hemi = new THREE.HemisphereLight(0xfff3df, 0xcf9c5c, 0.55);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xfff1d8, 1.55);
  key.position.set(2.2, 3.4, 3);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 10;
  key.shadow.radius = 6;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xbfe0ff, 0.5);
  rim.position.set(-2.4, 1.6, -2.4);
  scene.add(rim);

  const fill = new THREE.PointLight(0xffe2b8, 0.4, 8);
  fill.position.set(-1.4, 1, 2.4);
  scene.add(fill);

  // Round wooden "plate" platform the cat sits on.
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.55, 1.6, 0.16, 48),
    new THREE.MeshPhysicalMaterial({ color: 0xf6e2c2, roughness: 0.6, clearcoat: 0.3 })
  );
  plate.position.y = -1.05;
  plate.receiveShadow = true;
  scene.add(plate);

  const plateRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.57, 0.05, 16, 48),
    new THREE.MeshPhysicalMaterial({ color: 0xd9a86a, roughness: 0.5 })
  );
  plateRim.rotation.x = Math.PI / 2;
  plateRim.position.y = -0.97;
  scene.add(plateRim);

  // Little coffee cup prop beside the cat.
  const cupGroup = new THREE.Group();
  const cupBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.2, 0.32, 24, 1, true),
    new THREE.MeshPhysicalMaterial({ color: 0xfffaf2, roughness: 0.3, clearcoat: 0.6, side: THREE.DoubleSide })
  );
  cupGroup.add(cupBody);
  const coffee = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.02, 24),
    new THREE.MeshPhysicalMaterial({ color: 0x6b4326, roughness: 0.35, clearcoat: 0.8 })
  );
  coffee.position.y = 0.16;
  cupGroup.add(coffee);
  const cupBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.02, 24),
    new THREE.MeshPhysicalMaterial({ color: 0xfffaf2, roughness: 0.3 })
  );
  cupBase.position.y = -0.17;
  cupGroup.add(cupBase);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.11, 0.03, 10, 20, Math.PI * 1.4),
    new THREE.MeshPhysicalMaterial({ color: 0xfffaf2, roughness: 0.3 })
  );
  handle.rotation.z = Math.PI / 2.4;
  handle.position.set(0.28, 0, 0);
  cupGroup.add(handle);
  cupGroup.position.set(1.05, -0.82, 0.55);
  cupGroup.scale.setScalar(1.1);
  cupGroup.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(cupGroup);

  let catGroup = null;
  let idleT = Math.random() * 10;
  let bounce = 0; // 0..1 progress of a pet squash animation

  function setCat(colorKey) {
    if (catGroup) {
      scene.remove(catGroup);
      catGroup.traverse((o) => {
        if (o.isMesh) {
          o.geometry.dispose();
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
    }
    catGroup = createCatModel(colorKey);
    catGroup.position.set(-0.35, -0.42, 0.1);
    catGroup.scale.setScalar(1.05);
    scene.add(catGroup);
  }

  function playPetBounce() {
    bounce = 1;
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
    idleT += dt;

    if (catGroup) {
      const bob = Math.sin(idleT * 2.1) * 0.03;
      catGroup.position.y = -0.42 + bob;
      catGroup.rotation.y = Math.sin(idleT * 0.6) * 0.12;

      if (bounce > 0) {
        bounce = Math.max(0, bounce - dt * 3.2);
        const squash = 1 - Math.sin(bounce * Math.PI) * 0.14;
        const stretch = 1 + Math.sin(bounce * Math.PI) * 0.1;
        catGroup.scale.set(1.05 * stretch, 1.05 * squash, 1.05 * stretch);
      } else {
        catGroup.scale.setScalar(1.05);
      }
    }

    cupGroup.position.y = -0.82 + Math.sin(idleT * 1.6 + 1) * 0.015;
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", resize);
  resize();
  animate();

  return {
    setCat,
    pet: playPetBounce,
    resize,
    dispose() {
      running = false;
      window.removeEventListener("resize", resize);
      renderer.dispose();
    },
  };
}
