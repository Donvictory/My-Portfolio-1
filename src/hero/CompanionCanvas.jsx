import { Component } from "react";
import { Canvas } from "@react-three/fiber";
import Companion from "./Companion";
import { useDocumentTheme, usePrefersReducedMotion } from "../scene/sceneTheme";

class CompanionBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const LIGHTS = {
  light: { sky: "#fff6e8", ground: "#b9a58c", hemi: 1.5, key: 1.7 },
  dark: { sky: "#f2e6d4", ground: "#3a3128", hemi: 1.1, key: 1.5 },
};

export default function CompanionCanvas({ companion, active, onReady, onFail }) {
  const theme = useDocumentTheme();
  const reducedMotion = usePrefersReducedMotion();
  const lights = LIGHTS[theme];

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <CompanionBoundary onFail={onFail}>
        <Canvas
          flat
          dpr={[1, 2]}
          frameloop={active ? "always" : "never"}
          gl={{ antialias: true, alpha: true }}
          camera={{ fov: 20 }}
          onCreated={onReady}
        >
          <hemisphereLight args={[lights.sky, lights.ground, lights.hemi]} />
          <directionalLight position={[-0.6, 1, 0.9]} color="#fff1de" intensity={lights.key} />
          <Companion companion={companion} theme={theme} reducedMotion={reducedMotion} />
        </Canvas>
      </CompanionBoundary>
    </div>
  );
}
