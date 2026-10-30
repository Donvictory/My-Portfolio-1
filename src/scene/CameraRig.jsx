import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { KEYFRAMES } from "./cameraPath";

const LAST = KEYFRAMES.length - 1;
const CAMERA_LAMBDA = 2.2; // lower = the camera trails scroll longer
const INTENSITY_LAMBDA = 2.5;

// The keyframes place the sculpture beside desktop layouts. Portrait screens have no side space,
// so there the sculpture is re-centred (camera and target shifted together) and the camera
// pulls back a little.
const framed = (frame, portrait) => {
  if (!portrait) return frame;
  const [px, py, pz] = frame.position;
  const [tx, ty, tz] = frame.target;
  return { position: [px - tx, py, pz * 1.25], target: [0, ty, tz] };
};

const toCurve = (key, portrait) =>
  new THREE.CatmullRomCurve3(
    KEYFRAMES.map((frame) => new THREE.Vector3(...framed(frame, portrait)[key])),
    false,
    "centripetal"
  );

const toCurves = (portrait) => ({ position: toCurve("position", portrait), target: toCurve("target", portrait) });

// Holds a keyframe's intensity through most of its section, then blends into the next one.
function intensityAt(progress) {
  const i = Math.min(Math.floor(progress), LAST - 1);
  const blend = THREE.MathUtils.smoothstep(progress - i, 0.6, 1);
  return THREE.MathUtils.lerp(KEYFRAMES[i].intensity, KEYFRAMES[i + 1].intensity, blend);
}

// Writes the damped scroll progress into progressRef; the sculpture reads the same value.
export default function CameraRig({ getProgress, progressRef, layerRef, reducedMotion }) {
  const framings = useMemo(() => ({ landscape: toCurves(false), portrait: toCurves(true) }), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const intensity = useRef(0);

  useFrame(({ camera, size }, delta) => {
    const dt = Math.min(delta, 0.1); // avoid a jump after the tab was hidden
    const portrait = size.width < size.height;

    // Portrait screens widen the lens so the off-axis stations stay in frame.
    const fov = portrait ? 52 : 35;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    const target = getProgress();

    progressRef.current =
      progressRef.current === null || reducedMotion
        ? target
        : THREE.MathUtils.damp(progressRef.current, target, CAMERA_LAMBDA, dt);

    // Reduced motion holds the hero framing; the sculpture snaps between poses instead.
    const t = reducedMotion ? 0 : progressRef.current / LAST;
    const curves = portrait ? framings.portrait : framings.landscape;
    curves.position.getPoint(t, camera.position);
    curves.target.getPoint(t, lookAt);
    camera.lookAt(lookAt);

    // On portrait screens the sculpture sits centred under the text, so it stays quieter
    // throughout; it also steps back while the hero intro builds the headline
    // (see hero/introTimeline.js).
    const heroIntroPlaying = document.documentElement.dataset.heroIntro === "playing";
    const goal = intensityAt(progressRef.current) * (portrait ? 0.4 : 1) * (heroIntroPlaying ? 0.25 : 1);
    intensity.current = THREE.MathUtils.damp(intensity.current, goal, INTENSITY_LAMBDA, dt);
    if (layerRef.current) layerRef.current.style.opacity = intensity.current.toFixed(3);
  });

  return null;
}
