import { Component, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import Sculpture from "./Sculpture";
import { KEYFRAMES, SECTION_IDS } from "./cameraPath";
import { SCENE_PALETTES, useDocumentTheme, usePrefersReducedMotion } from "./sceneTheme";
import { useScrollProgress } from "./useScrollProgress";

const THEME_LAMBDA = 6;

class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function SceneEnvironment({ theme, reducedMotion, progressRef }) {
  const fog = useRef();
  const hemi = useRef();
  const key = useRef();
  const synced = useRef(false);

  const materials = useMemo(
    () => ({
      solid: new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0 }),
      accent: new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0.05 }),
      line: new THREE.LineBasicMaterial({ transparent: true }),
    }),
    []
  );

  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials]);

  useFrame((_, delta) => {
    const palette = SCENE_PALETTES[theme];
    const blend = synced.current ? 1 - Math.exp(-THEME_LAMBDA * Math.min(delta, 0.1)) : 1;
    synced.current = true;

    fog.current.color.lerp(palette.background, blend);
    materials.solid.color.lerp(palette.solid, blend);
    materials.accent.color.lerp(palette.accent, blend);
    materials.line.color.lerp(palette.line, blend);
    materials.line.setValues({
      opacity: THREE.MathUtils.lerp(materials.line.opacity, palette.lineOpacity, blend),
    });
    hemi.current.color.lerp(palette.sky, blend);
    hemi.current.groundColor.lerp(palette.ground, blend);
    hemi.current.intensity = THREE.MathUtils.lerp(hemi.current.intensity, palette.hemiIntensity, blend);
    key.current.color.lerp(palette.key, blend);
    key.current.intensity = THREE.MathUtils.lerp(key.current.intensity, palette.keyIntensity, blend);
  });

  return (
    <>
      <fog ref={fog} attach="fog" args={["#ffffff", 7, 32]} />
      <hemisphereLight ref={hemi} />
      <directionalLight ref={key} position={[6, 9, 6]} />
      <Sculpture materials={materials} progressRef={progressRef} reducedMotion={reducedMotion} />
    </>
  );
}

function Scene({ layerRef, getProgress }) {
  const theme = useDocumentTheme();
  const reducedMotion = usePrefersReducedMotion();
  const progressRef = useRef(null);

  return (
    <>
      <CameraRig
        getProgress={getProgress}
        progressRef={progressRef}
        layerRef={layerRef}
        reducedMotion={reducedMotion}
      />
      <SceneEnvironment theme={theme} reducedMotion={reducedMotion} progressRef={progressRef} />
    </>
  );
}

export default function SceneCanvas() {
  const layerRef = useRef(null);
  const getProgress = useScrollProgress(SECTION_IDS);

  return (
    <div ref={layerRef} className="scene-layer" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          flat
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ fov: 35, near: 0.1, far: 120, position: KEYFRAMES[0].position }}
        >
          <Scene layerRef={layerRef} getProgress={getProgress} />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
