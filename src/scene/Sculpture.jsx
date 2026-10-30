import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMorphingFrameGeometry } from "./frameGeometry";
import { INTRO_ORDER, LINKS, PART_ORDER, POSES, SCATTER } from "./sculpturePoses";

const LAST = POSES.length - 1;

const TRANSITION_START = 0.3;
const TRANSITION_STAGGER = 0.05;
const TRANSITION_SPAN = 0.4;

const INTRO_DELAY = 0.3;
const INTRO_STAGGER = 0.18;
const INTRO_DURATION = 1.4;
const FRAME_EDGE_VERTICES = 24;

const toPose = ({ position, rotation, scale, morph = 0 }) => ({
  position: new THREE.Vector3(...position),
  quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
  scale: typeof scale === "number" ? new THREE.Vector3().setScalar(scale) : new THREE.Vector3(...scale),
  morph,
});

const compile = ({ root, parts }) => ({
  root: toPose(root),
  parts: Object.fromEntries(Object.entries(parts).map(([name, part]) => [name, toPose(part)])),
});

const COMPILED_POSES = POSES.map(compile);
const COMPILED_SCATTER = compile(SCATTER);

function blendPose(object, from, to, t) {
  object.position.lerpVectors(from.position, to.position, t);
  object.quaternion.slerpQuaternions(from.quaternion, to.quaternion, t);
  object.scale.lerpVectors(from.scale, to.scale, t);
  if (object.morphTargetInfluences) {
    object.morphTargetInfluences[0] = THREE.MathUtils.lerp(from.morph, to.morph, t);
  }
}

function pullToward(object, pose, t) {
  object.position.lerp(pose.position, t);
  object.quaternion.slerp(pose.quaternion, t);
  object.scale.lerp(pose.scale, t);
  if (object.morphTargetInfluences) {
    object.morphTargetInfluences[0] = THREE.MathUtils.lerp(object.morphTargetInfluences[0], pose.morph, t);
  }
}

function boxEdges() {
  const box = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(box);
  box.dispose();
  return edges;
}

export default function Sculpture({ materials, progressRef, reducedMotion }) {
  const root = useRef();
  const parts = useRef({});
  const elapsed = useRef(0);
  const introClock = useRef(0);

  const geometries = useMemo(
    () => ({
      link: createMorphingFrameGeometry(),
      hoop: new THREE.TorusGeometry(1, 0.012, 8, 200),
      frame: boxEdges(),
    }),
    []
  );

  useEffect(() => () => Object.values(geometries).forEach((geometry) => geometry.dispose()), [geometries]);

  const register = (name) => (object) => {
    parts.current[name] = object;
  };

  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, 0.1);
    const time = elapsed.current;
    if (document.documentElement.dataset.heroIntro !== "playing") introClock.current += Math.min(delta, 0.1);

    const progress = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, LAST);
    const index = Math.min(Math.floor(progress), LAST - 1);
    const fraction = reducedMotion ? Math.round(progress - index) : progress - index;
    const from = COMPILED_POSES[index];
    const to = COMPILED_POSES[index + 1];

    blendPose(root.current, from.root, to.root, THREE.MathUtils.smootherstep(fraction, TRANSITION_START, 1));
    if (!reducedMotion) {
      root.current.rotateY(Math.sin(time * 0.12) * 0.12);
      root.current.rotateX(Math.sin(time * 0.09 + 1) * 0.04);
    }

    PART_ORDER.forEach((name, order) => {
      const start = TRANSITION_START + order * TRANSITION_STAGGER;
      const t = THREE.MathUtils.smootherstep(fraction, start, start + TRANSITION_SPAN);
      blendPose(parts.current[name], from.parts[name], to.parts[name], t);
    });

    INTRO_ORDER.forEach((name, order) => {
      const start = INTRO_DELAY + order * INTRO_STAGGER;
      const assembled = reducedMotion ? 1 : THREE.MathUtils.smootherstep(introClock.current, start, start + INTRO_DURATION);
      if (name === "frame") {
        const edges = Math.floor(assembled * FRAME_EDGE_VERTICES / 2) * 2;
        geometries.frame.setDrawRange(0, edges >= FRAME_EDGE_VERTICES ? Infinity : edges);
      } else if (assembled < 1) {
        pullToward(parts.current[name], COMPILED_SCATTER.parts[name], 1 - assembled);
      }
    });
  });

  return (
    <group ref={root}>
      {LINKS.map((name, i) => (
        <mesh
          key={name}
          ref={register(name)}
          args={[geometries.link, i % 2 === 0 ? materials.solid : materials.accent]}
          frustumCulled={false}
        />
      ))}
      <mesh ref={register("hoop")} geometry={geometries.hoop} material={materials.accent} />
      <lineSegments ref={register("frame")} geometry={geometries.frame} material={materials.line} />
    </group>
  );
}
