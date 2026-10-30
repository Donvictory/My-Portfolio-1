const HALF_PI = Math.PI / 2;

export const LINKS = ["link0", "link1", "link2", "link3", "link4"];

export const PART_ORDER = ["hoop", ...LINKS, "frame"];
export const INTRO_ORDER = [...LINKS, "hoop", "frame"];

const ring = (position, rotation) => ({ position, rotation, scale: 1, morph: 0 });
const frame = (position, rotationY) => ({ position, rotation: [0, rotationY, 0], scale: 1, morph: 1 });

const ASSEMBLED = {
  root: { position: [0, 0, 0], rotation: [0.35, -0.5, 0.2], scale: 0.62 },
  parts: {
    link0: ring([0, 0, 0], [0, 0, 0]),
    link1: ring([-1.35, 0, 0], [HALF_PI, 0, 0]),
    link2: ring([1.35, 0, 0], [HALF_PI, 0, 0]),
    link3: ring([0, 1.35, 0], [0, HALF_PI, 0]),
    link4: ring([0, -1.35, 0], [0, HALF_PI, 0]),
    hoop: { position: [0, 0, 0], rotation: [0.35, 0.85, 0.2], scale: 2.6 },
    frame: { position: [0, 0, 0], rotation: [Math.PI / 4, Math.PI / 5, 0], scale: 2.4 },
  },
};

const PROJECTS = {
  root: { position: [0, 0, 0], rotation: [0.12, 0.45, 0.04], scale: 0.85 },
  parts: {
    link0: frame([-1.25, 1.7, 0], 0.04),
    link1: frame([1.25, 1.7, -0.3], -0.03),
    link2: frame([-1.25, 0, -0.6], 0.05),
    link3: frame([1.25, 0, -0.9], -0.04),
    link4: frame([-1.25, -1.7, -1.2], 0.03),
    hoop: { position: [0.6, 0, -2.2], rotation: [0, 0, 0], scale: 3.4 },
    frame: { position: [0, 0, -0.6], rotation: [0, 0, 0], scale: [5.6, 5.3, 1.6] },
  },
};

export const POSES = [ASSEMBLED, PROJECTS, ASSEMBLED, ASSEMBLED, ASSEMBLED, ASSEMBLED];

const scatterLink = ({ position, rotation, ...rest }, i) => ({
  ...rest,
  position: position.some((v) => v !== 0)
    ? position.map((v, axis) => v * 2.4 + (axis === 2 ? (i % 2 ? 1.2 : -1.2) : 0))
    : [0, 0, 2.2],
  rotation: [rotation[0] + 0.9, rotation[1] - 0.6, rotation[2]],
});

export const SCATTER = {
  root: ASSEMBLED.root,
  parts: {
    ...Object.fromEntries(LINKS.map((name, i) => [name, scatterLink(ASSEMBLED.parts[name], i)])),
    hoop: { ...ASSEMBLED.parts.hoop, scale: ASSEMBLED.parts.hoop.scale * 1.8 },
    frame: ASSEMBLED.parts.frame,
  },
};
