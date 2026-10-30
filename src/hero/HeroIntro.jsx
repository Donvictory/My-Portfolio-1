import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createCompanionState, createHeroIntro, createLiteReveal, fitOverlay, hidesHeadline } from "./introTimeline";

// three.js and the companion load after the page content, in their own chunk
const CompanionCanvas = lazy(() => import("./CompanionCanvas"));

const READY_TIMEOUT = 5000; // give up on the companion and reveal the headline plainly

// A chunk that fails to load must not take the page down with it
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

// Mounted as the hero section's first child. The section is read from the overlay's parent:
// a parent's ref is not attached yet when this child's layout effects run.
export default function HeroIntro({ mode }) {
  const overlayRef = useRef(null);
  const propsLayerRef = useRef(null);
  const [companion] = useState(createCompanionState);
  const [status, setStatus] = useState(mode === "lite" ? "failed" : "loading"); // loading | ready | failed
  const [active, setActive] = useState(true);

  // The canvas needs a sized overlay before it can start
  useLayoutEffect(() => {
    if (status === "failed") return;
    const overlay = overlayRef.current;
    const refit = () => fitOverlay(overlay.parentElement, overlay);
    refit();
    window.addEventListener("resize", refit);
    return () => window.removeEventListener("resize", refit);
  }, [status]);

  // Render the companion only while the hero is on screen
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
    // Word positions are only final once the web font has loaded
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

  // The overlay stays mounted without a companion too: it is how the section is found
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
      {/* Carried words live here, above the canvas; the intro adds them imperatively */}
      <div ref={propsLayerRef} />
    </div>
  );
}
