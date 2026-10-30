import { useSyncExternalStore } from "react";
import * as THREE from "three";

const PALETTES = {
  light: {
    background: "#f4efe6",
    solid: "#e4dccd",
    accent: "#cbbba1",
    line: "#3d372e",
    sky: "#fff8ec",
    ground: "#cbbfac",
    key: "#fff1dc",
    hemiIntensity: 1.6,
    keyIntensity: 1.8,
    lineOpacity: 0.4,
  },
  dark: {
    background: "#121110",
    solid: "#2b2926",
    accent: "#3d3730",
    line: "#d6cdbd",
    sky: "#8c8274",
    ground: "#0c0b0a",
    key: "#f2e4cc",
    hemiIntensity: 1.1,
    keyIntensity: 1.4,
    lineOpacity: 0.28,
  },
};

const COLOR_KEYS = ["background", "solid", "accent", "line", "sky", "ground", "key"];

export const SCENE_PALETTES = Object.fromEntries(
  Object.entries(PALETTES).map(([name, palette]) => [
    name,
    {
      ...palette,
      ...Object.fromEntries(COLOR_KEYS.map((key) => [key, new THREE.Color(palette[key])])),
    },
  ])
);

const subscribeTheme = (onChange) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
};

export const useDocumentTheme = () =>
  useSyncExternalStore(subscribeTheme, () =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeReducedMotion = (onChange) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION_QUERY).matches);
