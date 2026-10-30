import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress(sectionIds) {
  const triggers = useRef([]);

  useEffect(() => {
    triggers.current = sectionIds.map((id) => {
      const section = document.getElementById(id);
      return section ? ScrollTrigger.create({ trigger: section, start: "top center" }) : null;
    });
    return () => triggers.current.forEach((trigger) => trigger?.kill());
  }, [sectionIds]);

  return useCallback(() => {
    if (!triggers.current.length) return 0;

    let previous = 0;
    const anchors = triggers.current.map((trigger, i) =>
      (previous = i === 0 || !trigger ? previous : Math.max(previous, trigger.start))
    );
    anchors.push(Math.max(previous, ScrollTrigger.maxScroll(window)));

    const scroll = window.scrollY;
    for (let i = 0; i < anchors.length - 1; i++) {
      if (scroll < anchors[i + 1]) {
        return Math.max(0, i + (scroll - anchors[i]) / Math.max(anchors[i + 1] - anchors[i], 1));
      }
    }
    return anchors.length - 1;
  }, []);
}
