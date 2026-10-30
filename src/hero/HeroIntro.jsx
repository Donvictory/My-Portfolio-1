import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createCompanionState, createHeroIntro, createLiteReveal, fitOverlay, hidesHeadline } from "./introTimeline";

const CompanionCanvas = lazy(() => import("./CompanionCanvas"));

const READY_TIMEOUT = 5000;

class LoadBoundary extends Component {
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

export default function HeroIntro({ mode }) {
  const overlayRef = useRef(null);
  const propsLayerRef = useRef(null);
  const [companion] = useState(createCompanionState);
  const [status, setStatus] = useState(mode === "lite" ? "failed" : "loading");
  const [active, setActive] = useState(true);

  useLayoutEffect(() => {
    if (status === "failed") return;
    const overlay = overlayRef.current;
    const refit = () => fitOverlay(overlay.parentElement, overlay);
    refit();
    window.addEventListener("resize", refit);
    return () => window.removeEventListener("resize", refit);
  }, [status]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    observer.observe(overlayRef.current.parentElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => setStatus("failed"), READY_TIMEOUT);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status === "failed" && hidesHeadline(mode)) return createLiteReveal(overlayRef.current.parentElement);
  }, [status, mode]);

  useEffect(() => {
    if (status !== "ready") return;
    let destroy;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const overlay = overlayRef.current;
      destroy = createHeroIntro({
        section: overlay.parentElement,
        overlay,
        propsLayer: propsLayerRef.current,
        companion,
        mode,
      });
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [status, mode, companion]);

  return (
    <div ref={overlayRef} className="hero-companion" aria-hidden="true">
      {status !== "failed" && (
        <LoadBoundary onFail={() => setStatus("failed")}>
          <Suspense fallback={null}>
            <CompanionCanvas
              companion={companion}
              active={active}
              onReady={() => setStatus((current) => (current === "loading" ? "ready" : current))}
              onFail={() => setStatus("failed")}
            />
          </Suspense>
        </LoadBoundary>
      )}
      <div ref={propsLayerRef} />
    </div>
  );
}
