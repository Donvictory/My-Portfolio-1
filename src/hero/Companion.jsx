import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FOOT_HEIGHT, HIP_HEIGHT, LEG_SEGMENT, createCompanionRig } from "./companionRig";

const COLORS = {
  light: { body: "#c98c6a", eye: "#2b221d", shadow: "#5a4630", shadowOpacity: 0.22 },
  dark: { body: "#d69b78", eye: "#1b1512", shadow: "#000000", shadowOpacity: 0.45 },
};

const STRIDE = 0.36; // body heights travelled per step
const BLINK_DURATION = 0.16;
const { lerp, damp } = THREE.MathUtils;

const randomBetween = (min, max) => min + Math.random() * (max - min);

// Poses the rig from the intro's shared state every frame: gait from distance travelled,
// legs solved to stay on the line, arms blended between swing, carry and reach, plus
// breathing, blinking and the occasional idle glance.
export default function Companion({ companion, theme, reducedMotion }) {
  const rig = useMemo(() => createCompanionRig(), []);
  const scratch = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3() }), []);
  const motion = useRef({ time: 0, phase: 0, lastX: null, nextBlink: 2, blinkAt: -1, nextGlance: 6, glance: 0, glanceTarget: 0 });

  useEffect(() => () => rig.dispose(), [rig]);

  useEffect(() => {
    const colors = COLORS[theme];
    rig.materials.body.color.set(colors.body);
    rig.materials.eye.color.set(colors.eye);
    rig.materials.shadow.color.set(colors.shadow);
    rig.materials.shadow.setValues({ opacity: colors.shadowOpacity });
  }, [rig, theme]);

  useFrame(({ camera, size }, delta) => {
    // Pixel-mapped camera: the z = 0 plane lines up 1:1 with the overlay's CSS pixels, y down
    if (camera.userData.width !== size.width || camera.userData.height !== size.height) {
      const distance = size.height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(size.width / 2, -size.height / 2, distance);
      camera.lookAt(size.width / 2, -size.height / 2, 0);
      camera.near = distance * 0.2;
      camera.far = distance * 2;
      camera.updateProjectionMatrix();
      camera.userData = { width: size.width, height: size.height };
    }

    const s = companion;
    const m = motion.current;
    const dt = Math.min(delta, 0.1);
    m.time += dt;

    rig.root.position.set(s.x, -s.y, 0);
    rig.root.scale.setScalar(s.height);

    // Gait advances with distance, so feet keep pace with however the timeline moves x;
    // teleports (skip, resize) are ignored
    const moved = m.lastX === null ? 0 : Math.abs(s.x - m.lastX);
    m.lastX = s.x;
    if (moved < s.height) m.phase += (moved / (s.height * STRIDE * (1 - 0.25 * s.carry))) * Math.PI;
    const phase = m.phase;
    const walk = s.walk;

    const crouch = Math.max(0, s.crouch);
    const bodyY = -0.075 * crouch + walk * (0.02 * Math.abs(Math.sin(phase)) - 0.012 * s.carry);
    rig.body.position.setY(bodyY);
    rig.facing.rotation.set(0, s.facing, Math.sin(phase) * 0.035 * walk);

    const breath = Math.sin(m.time * 1.7) * 0.012 * (reducedMotion ? 0.5 : 1);
    const squash = s.squash + breath + 0.02 * s.carry;
    rig.bones.hips.scale.set(1 + squash * 0.5, 1 - squash, 1 + squash * 0.5);
    rig.bones.chest.rotation.set(s.lean + 0.18 * crouch + 0.2 * s.reach - 0.1 * s.carry + 0.05 * walk, 0, 0);

    if (s.idle && !reducedMotion) {
      if (m.time > m.nextGlance) {
        m.glanceTarget = m.glanceTarget === 0 ? randomBetween(-0.35, 0.35) : 0;
        m.nextGlance = m.time + (m.glanceTarget === 0 ? randomBetween(4, 7) : randomBetween(1, 1.8));
      }
    } else {
      m.glanceTarget = 0;
    }
    m.glance = damp(m.glance, m.glanceTarget, 4, dt);
    rig.bones.head.rotation.set(s.lookPitch, s.lookYaw + m.glance, 0);

    // Legs: two equal segments solved so the feet stay on the line as the body dips
    const reachDown = Math.min(HIP_HEIGHT + bodyY - FOOT_HEIGHT, 2 * LEG_SEGMENT - 1e-4);
    const bend = Math.acos(reachDown / (2 * LEG_SEGMENT));
    rig.legs.forEach((leg, i) => {
      const legPhase = phase + i * Math.PI;
      const swing = Math.sin(legPhase) * 0.42 * walk;
      const lift = Math.max(0, Math.cos(legPhase)) * walk;
      const hip = -bend - swing - lift * 0.35;
      const knee = 2 * bend + lift * 0.75;
      leg.hip.rotation.set(hip, 0, 0);
      leg.knee.rotation.set(knee, 0, 0);
      leg.foot.rotation.set(-(hip + knee) * 0.8, 0, 0);
    });

    // Arms: swing against the legs, raised overhead to carry, forward to reach and place
    rig.arms.forEach((arm, i) => {
      const swing = Math.sin(phase + (i === 0 ? Math.PI : 0)) * 0.45 * walk * (1 - s.carry);
      const pitch = lerp(lerp(swing, -2.75, s.carry), lerp(-1.15, -1.55, s.carry), s.reach);
      const roll = lerp(lerp(arm.side * 0.12, -arm.side * 0.3, s.carry), -arm.side * 0.12, s.reach);
      arm.shoulder.rotation.set(pitch, 0, roll);
      arm.elbow.rotation.set(lerp(-0.15, -0.35, Math.max(s.carry, s.reach)), 0, 0);
    });

    // Blinks at irregular intervals; squints when happy, widens when surprised
    if (m.time > m.nextBlink) {
      m.blinkAt = m.time;
      m.nextBlink = m.time + randomBetween(2.2, 5.5);
    }
    const blinkProgress = (m.time - m.blinkAt) / BLINK_DURATION;
    const blink = blinkProgress >= 0 && blinkProgress < 1 ? 1 - Math.sin(Math.PI * blinkProgress) * 0.92 : 1;
    const open = blink * (1 - 0.55 * s.happy) * (1 + 0.22 * s.surprise);
    rig.eyes.forEach((eye) => eye.scale.set(1 + 0.12 * s.surprise, open, 1));

    // The carried stack: from its resting spot on the line to the hands, as it is picked up
    const stack = s.stack;
    if (stack.el) {
      rig.root.updateMatrixWorld(true);
      rig.arms[0].hand.getWorldPosition(scratch.a);
      rig.arms[1].hand.getWorldPosition(scratch.b);
      scratch.a.add(scratch.b).multiplyScalar(0.5).project(camera);
      const handsX = ((scratch.a.x + 1) / 2) * size.width;
      const handsY = ((1 - scratch.a.y) / 2) * size.height - 0.04 * s.height;
      const x = lerp(stack.x, handsX, stack.attach);
      const y = lerp(stack.y + stack.drop, handsY, stack.attach);
      stack.el.style.setProperty("transform", `translate(${x}px, ${y}px) translate(-50%, -100%) scale(${stack.scale})`);
    }
  });

  return <primitive object={rig.root} />;
}
