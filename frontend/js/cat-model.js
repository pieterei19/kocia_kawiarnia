import * as THREE from "../lib/three/three.module.js";

// Paleta kolorów dla każdego kotka - baza futra, plama, wnętrze uszu, akcent nosa.
export const CAT_COLORS = {
  milus: { body: 0xfdf1e0, patch: 0xe8823c, ear: 0xf6c9d6, nose: 0xf19aa4 },
  czarny: { body: 0x2b2420, patch: 0x453a32, ear: 0x6b564a, nose: 0xcf8a8a },
  "biały": { body: 0xfefaf3, patch: 0xf0e6d8, ear: 0xf6c9d6, nose: 0xf19aa4 },
  tygrys: { body: 0xf0a94e, patch: 0xc97a1e, ear: 0xf6c9d6, nose: 0xf19aa4 },
  lew: { body: 0xf2c14e, patch: 0xd99a2b, ear: 0xf6c9d6, nose: 0xf19aa4 },
  panda: { body: 0xfefefe, patch: 0x2b2420, ear: 0x2b2420, nose: 0xf19aa4 },
  koala: { body: 0xc9c2ba, patch: 0xa89e93, ear: 0xe8c4cc, nose: 0xf19aa4 },
  lis: { body: 0xf2955a, patch: 0xfefaf3, ear: 0xf6c9d6, nose: 0xf19aa4 },
};

function softMaterial(color, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: opts.roughness ?? 0.55,
    metalness: 0.02,
    clearcoat: opts.clearcoat ?? 0.35,
    clearcoatRoughness: 0.35,
    sheen: 1,
    sheenColor: new THREE.Color(0xffffff),
    sheenRoughness: 0.8,
  });
}

/**
 * Buduje stylizowany model kotka "chibi 3D": duża głowa, mała owalna sylwetka,
 * wielkie oczy i miękkie, malarskie cieniowanie (zamiast płaskiego SVG).
 */
export function createCatModel(colorKey) {
  const colors = CAT_COLORS[colorKey] || CAT_COLORS.milus;
  const group = new THREE.Group();
  group.name = "cat-" + colorKey;

  const bodyMat = softMaterial(colors.body);
  const patchMat = softMaterial(colors.patch, { roughness: 0.6, clearcoat: 0.2 });
  const earMat = softMaterial(colors.ear, { roughness: 0.7, clearcoat: 0.15 });
  const noseMat = softMaterial(colors.nose, { roughness: 0.4, clearcoat: 0.6 });
  const eyeMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2018, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 });
  const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // --- Body (small, round, sits low) ---
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 24), bodyMat);
  body.scale.set(1, 0.82, 0.92);
  body.position.set(0, -0.32, 0);
  group.add(body);

  // Front paws
  [-0.32, 0.32].forEach((x) => {
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), bodyMat);
    paw.position.set(x, -0.78, 0.42);
    paw.scale.set(1, 0.85, 1.1);
    group.add(paw);
  });

  // --- Head (big, chibi proportions) ---
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 24), bodyMat);
  head.position.set(0, 0.42, 0);
  group.add(head);

  // Cheek fluff (wider lower face)
  const cheeks = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 24), bodyMat);
  cheeks.scale.set(1.08, 0.62, 0.98);
  cheeks.position.set(0, 0.18, 0.05);
  group.add(cheeks);

  // Ears
  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.4, 4), bodyMat);
    ear.rotation.z = side * -0.32;
    ear.rotation.y = Math.PI / 4;
    ear.position.set(side * 0.46, 0.98, 0);
    group.add(ear);

    const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 4), earMat);
    innerEar.rotation.z = side * -0.32;
    innerEar.rotation.y = Math.PI / 4;
    innerEar.position.set(side * 0.44, 0.92, 0.05);
    group.add(innerEar);
  });

  // Face patch marking (flattened dome overlapping the head surface)
  const patch = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 16, 0, Math.PI * 1.3), patchMat);
  patch.position.set(0.42, 0.5, -0.1);
  patch.rotation.y = Math.PI * 0.65;
  patch.scale.set(0.8, 0.8, 0.55);
  group.add(patch);

  // Eyes (big + glossy highlight = kawaii look)
  [-0.27, 0.27].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 16), eyeMat);
    eye.position.set(x, 0.42, 0.63);
    eye.scale.set(0.85, 1.05, 0.7);
    group.add(eye);

    const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 10), highlightMat);
    highlight.position.set(x - 0.045, 0.47, 0.71);
    group.add(highlight);
  });

  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), noseMat);
  nose.position.set(0, 0.3, 0.72);
  nose.scale.set(1.3, 0.9, 0.8);
  group.add(nose);

  // Blush
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xf6a8c0, transparent: true, opacity: 0.45 });
  [-0.48, 0.48].forEach((x) => {
    const blush = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), blushMat);
    blush.position.set(x, 0.24, 0.55);
    blush.scale.set(1, 0.7, 0.3);
    group.add(blush);
  });

  // Tail (soft curved tube)
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.45, -0.55, -0.5),
    new THREE.Vector3(0.75, -0.35, -0.65),
    new THREE.Vector3(0.85, 0.05, -0.55),
    new THREE.Vector3(0.65, 0.3, -0.35),
  ]);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.11, 12, false), bodyMat);
  group.add(tail);

  group.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  // Expose parts used for pet/idle animation
  group.userData.head = head;
  group.userData.cheeks = cheeks;
  group.userData.body = body;

  return group;
}
