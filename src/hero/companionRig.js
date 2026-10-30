import * as THREE from "three";

const BODY = { centerY: 0.585, radiusY: 0.415, radiusX: 0.3, depth: 0.88 };
export const HIP_HEIGHT = 0.255;
export const LEG_SEGMENT = 0.11;
export const FOOT_HEIGHT = 0.035;

function createBodyGeometry() {
  const profile = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const theta = -Math.PI / 2 + (i / steps) * Math.PI;
    const radius = BODY.radiusX * Math.cos(theta) * (1 - 0.12 * Math.sin(theta));
    profile.push(new THREE.Vector2(Math.max(radius, 1e-4), BODY.centerY + BODY.radiusY * Math.sin(theta)));
  }
  const geometry = new THREE.LatheGeometry(profile, 48);
  geometry.scale(1, 1, BODY.depth);

  const position = geometry.attributes.position;
  const skinIndex = new Uint16Array(position.count * 4);
  const skinWeight = new Float32Array(position.count * 4);
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i);
    const [lower, upper, t] =
      y < 0.56 ? [1, 2, THREE.MathUtils.smoothstep(y, 0.36, 0.5)] : [2, 3, THREE.MathUtils.smoothstep(y, 0.6, 0.72)];
    skinIndex.set([lower, upper, 0, 0], i * 4);
    skinWeight.set([1 - t, t, 0, 0], i * 4);
  }
  geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndex, 4));
  geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeight, 4));
  return geometry;
}

function limb(length, radius, material) {
  const geometry = new THREE.CapsuleGeometry(radius, length, 6, 12);
  geometry.translate(0, -length / 2, 0);
  return new THREE.Mesh(geometry, material);
}

function createArm(side, material) {
  const shoulder = new THREE.Group();
  shoulder.position.set(side * 0.27, 0.06, 0);
  shoulder.add(limb(0.13, 0.038, material));
  const elbow = new THREE.Group();
  elbow.position.y = -0.13;
  shoulder.add(elbow);
  elbow.add(limb(0.11, 0.034, material));
  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), material);
  hand.position.y = -0.13;
  elbow.add(hand);
  return { side, shoulder, elbow, hand };
}

function createLeg(side, material) {
  const hip = new THREE.Group();
  hip.position.set(side * 0.1, HIP_HEIGHT, 0);
  hip.add(limb(LEG_SEGMENT, 0.046, material));
  const knee = new THREE.Group();
  knee.position.y = -LEG_SEGMENT;
  hip.add(knee);
  knee.add(limb(LEG_SEGMENT - 0.02, 0.043, material));
  const foot = new THREE.Group();
  foot.position.y = -LEG_SEGMENT;
  knee.add(foot);
  const sole = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), material);
  sole.scale.set(1, 0.62, 1.45);
  sole.position.z = 0.025;
  foot.add(sole);
  return { side, hip, knee, foot };
}

function createEye(side, eyeMaterial, glintMaterial) {
  const eye = new THREE.Group();
  eye.position.set(side * 0.115, -0.025, 0.222);
  eye.rotation.y = side * 0.47;
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 16), eyeMaterial);
  ball.scale.set(0.82, 1.12, 0.42);
  const glint = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), glintMaterial);
  glint.position.set(0.014, 0.026, 0.02);
  eye.add(ball, glint);
  return eye;
}

function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export function createCompanionRig() {
  const materials = {
    body: new THREE.MeshPhysicalMaterial({ roughness: 0.62, sheen: 0.35, sheenRoughness: 0.8, sheenColor: 0xffffff }),
    eye: new THREE.MeshStandardMaterial({ roughness: 0.18 }),
    glint: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    shadow: new THREE.MeshBasicMaterial({ map: createShadowTexture(), transparent: true, depthWrite: false }),
  };

  const root = new THREE.Group();
  const facing = new THREE.Group();
  const body = new THREE.Group();
  root.add(facing);
  facing.add(body);

  const spineRoot = new THREE.Bone();
  const hips = new THREE.Bone();
  const chest = new THREE.Bone();
  const head = new THREE.Bone();
  hips.position.y = 0.24;
  chest.position.y = 0.26;
  head.position.y = 0.22;
  spineRoot.add(hips);
  hips.add(chest);
  chest.add(head);

  const skin = new THREE.SkinnedMesh(createBodyGeometry(), materials.body);
  skin.frustumCulled = false;
  skin.add(spineRoot);
  skin.updateMatrixWorld(true);
  skin.bind(new THREE.Skeleton([spineRoot, hips, chest, head]));
  body.add(skin);

  const arms = [createArm(1, materials.body), createArm(-1, materials.body)];
  arms.forEach((arm) => chest.add(arm.shoulder));
  const eyes = [createEye(1, materials.eye, materials.glint), createEye(-1, materials.eye, materials.glint)];
  eyes.forEach((eye) => head.add(eye));
  const legs = [createLeg(1, materials.body), createLeg(-1, materials.body)];
  legs.forEach((leg) => body.add(leg.hip));

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materials.shadow);
  shadow.scale.set(0.78, 0.11, 1);
  shadow.position.z = -0.05;
  root.add(shadow);

  return {
    root,
    facing,
    body,
    bones: { hips, chest, head },
    arms,
    legs,
    eyes,
    materials,
    dispose() {
      root.traverse((object) => object.geometry?.dispose());
      materials.shadow.map.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
}
