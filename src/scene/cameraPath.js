// World units (1 ≈ 1m), +Y up. A single sculpture sits at the origin; the camera keyframes
// frame it in each section's open space. Section anchors map to keyframes 0–4; keyframe 5 is
// the resting shot at the page end. Poses for the sculpture live in sculpturePoses.js.
export const SECTION_IDS = ["intro", "works", "expertise", "about", "connect"];

// intensity: how present the scene is (canvas opacity) when the camera reaches this keyframe.
// Keyframes 2–5 are provisional until their Phase 2 poses exist.
export const KEYFRAMES = [
  { id: "intro", position: [-2.4, 0.5, 9], target: [-2.4, 0, 0], intensity: 1 },
  { id: "works", position: [-4.5, 2.2, 13.5], target: [-3.5, 0.2, 0], intensity: 0.3 },
  { id: "expertise", position: [-1.4, 0.8, 9.5], target: [-1.6, 0, 0], intensity: 0.55 },
  { id: "about", position: [-1.8, 0.3, 9], target: [-1.7, 0, 0], intensity: 0.6 },
  { id: "connect", position: [-1.6, 0.4, 8.5], target: [-1.6, 0, 0], intensity: 1 },
  { id: "end", position: [-1.5, 0.3, 7.8], target: [-1.4, 0, 0], intensity: 1 },
];
