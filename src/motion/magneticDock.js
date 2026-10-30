import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CABLE_LENGTH = 104;
const PULL_RAMP = 0.4;
const STEP = 1 / 240;
const ROTATION_STIFFNESS = 260;
const ROTATION_DAMPING = 2 * 0.3 * Math.sqrt(ROTATION_STIFFNESS);
const SVG_NS = "http://www.w3.org/2000/svg";

const vary = (seed, min, max) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return min + (s - Math.floor(s)) * (max - min);
};

const smoothstep = (t) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

const layers = new Map();

function acquireLayer(parent) {
  let entry = layers.get(parent);
  if (!entry) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "dock-cables");
    svg.setAttribute("aria-hidden", "true");
    const restorePosition = getComputedStyle(parent).position === "static";
    if (restorePosition) parent.style.position = "relative";
    parent.append(svg);
    entry = { svg, restorePosition, users: 0 };
    layers.set(parent, entry);
  }
  entry.users += 1;
  return entry.svg;
}

function releaseLayer(parent) {
  const entry = layers.get(parent);
  if (!entry || --entry.users > 0) return;
  entry.svg.remove();
  if (entry.restorePosition) parent.style.removeProperty("position");
  layers.delete(parent);
}

function createDock(card, index) {
  const seed = index + 1;
  const side = index % 2 === 0 ? 1 : -1;
  const params = {
    delayJitter: vary(seed, 0, 0.12),
    stiffness: vary(seed + 1, 150, 200),
    dampingRatio: vary(seed + 2, 0.46, 0.56),
    lift: vary(seed + 3, 64, 86),
    drift: vary(seed + 4, -12, 12),
    tilt: side * vary(seed + 5, 1.6, 3),
    couple: -side * vary(seed + 6, 0.35, 0.6),
  };

  const parent = card.parentElement;
  const svg = acquireLayer(parent);
  const group = document.createElementNS(SVG_NS, "g");
  const cables = [0, 1].map(() => document.createElementNS(SVG_NS, "path"));
  const pins = [0, 1].map(() => {
    const pin = document.createElementNS(SVG_NS, "circle");
    pin.setAttribute("r", "2.75");
    return pin;
  });
  group.append(...cables, ...pins);
  group.style.opacity = "0";
  svg.append(group);

  const s = { phase: "hidden", delay: 0, time: 0, pullTime: 0, x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 };
  let box = null;
  let fade = null;

  const render = () => {
    card.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.r}deg)`;

    const radians = (s.r * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const centerX = box.left + box.width / 2 + s.x;
    const centerY = box.top + box.height / 2 + s.y;
    [-1, 1].forEach((end, i) => {
      const anchorX = box.left + box.width * (i === 0 ? 0.22 : 0.78);
      const anchorY = box.top - CABLE_LENGTH;
      const localX = end * box.width * 0.28;
      const localY = -box.height / 2;
      const endX = centerX + localX * cos - localY * sin;
      const endY = centerY + localX * sin + localY * cos;
      const slack = Math.max(0, CABLE_LENGTH - Math.hypot(endX - anchorX, endY - anchorY));
      const sag = Math.min(36, slack * 0.4 + Math.abs(s.vx) * 0.012);
      const lag = Math.max(-18, Math.min(18, -s.vx * 0.02));
      const controlX = (anchorX + endX) / 2 + lag;
      const controlY = (anchorY + endY) / 2 + sag;
      cables[i].setAttribute("d", `M ${anchorX} ${anchorY} Q ${controlX} ${controlY} ${endX} ${endY}`);
      pins[i].setAttribute("cx", anchorX);
      pins[i].setAttribute("cy", anchorY);
    });
  };

  const settle = () => {
    s.phase = "settled";
    card.style.removeProperty("transform");
    fade = gsap.to(group, { opacity: 0, duration: 0.6, delay: 0.25, ease: "power1.out" });
  };

  return {
    get active() {
      return s.phase === "floating" || s.phase === "pulling";
    },
    start(order) {
      fade?.kill();
      box = { left: card.offsetLeft, top: card.offsetTop, width: card.offsetWidth, height: card.offsetHeight };
      Object.assign(s, { phase: "floating", delay: order * 0.09 + params.delayJitter, time: 0, pullTime: 0, x: params.drift, y: -params.lift, r: params.tilt, vx: 0, vy: 0, vr: 0 });
      render();
      gsap.to(card, { opacity: 1, duration: 0.35, ease: "power1.out", overwrite: true });
      gsap.to(group, { opacity: 1, duration: 0.3, overwrite: true });
    },
    reset() {
      fade?.kill();
      s.phase = "hidden";
      gsap.set(card, { opacity: 0, overwrite: true });
      gsap.set(group, { opacity: 0 });
      card.style.transform = `translate3d(${params.drift}px, ${-params.lift}px, 0) rotate(${params.tilt}deg)`;
    },
    step(dt) {
      s.time += dt;
      if (s.phase === "floating") {
        const bob = s.time * 2.4 + seed;
        s.y = -params.lift + Math.sin(bob) * 2.5;
        s.vy = Math.cos(bob) * 2.5 * 2.4;
        if (s.time >= s.delay) s.phase = "pulling";
        render();
        return;
      }

      const damping = 2 * params.dampingRatio * Math.sqrt(params.stiffness);
      const steps = Math.ceil(dt / STEP);
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        const k = params.stiffness * smoothstep(s.pullTime / PULL_RAMP);
        s.vy += (-k * s.y - damping * s.vy) * h;
        s.vx += (-k * 1.3 * s.x - damping * 1.15 * s.vx) * h;
        s.vr += (-ROTATION_STIFFNESS * s.r - ROTATION_DAMPING * s.vr + params.couple * s.vy) * h;
        s.y += s.vy * h;
        s.x += s.vx * h;
        s.r += s.vr * h;
        s.pullTime += h;
      }

      const still =
        s.pullTime > 0.6 &&
        Math.abs(s.y) < 0.1 &&
        Math.abs(s.vy) < 1.5 &&
        Math.abs(s.x) < 0.1 &&
        Math.abs(s.vx) < 1.5 &&
        Math.abs(s.r) < 0.01 &&
        Math.abs(s.vr) < 0.3;
      if (still) {
        Object.assign(s, { x: 0, y: 0, r: 0 });
        render();
        settle();
      } else {
        render();
      }
    },
    destroy() {
      fade?.kill();
      group.remove();
      releaseLayer(parent);
      gsap.set(card, { clearProps: "opacity,transform" });
    },
  };
}

export function dockCards(cards, { start = "top 88%", end = "bottom 8%" } = {}) {
  if (!cards.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const docks = new Map(cards.map((card, i) => [card, createDock(card, i)]));
  docks.forEach((dock) => dock.reset());

  const tick = (_time, deltaMs) => {
    const dt = Math.min(deltaMs / 1000, 1 / 30);
    docks.forEach((dock) => dock.active && dock.step(dt));
  };
  gsap.ticker.add(tick);

  const enter = (batch) => batch.forEach((card, order) => docks.get(card).start(order));
  const leave = (batch) => batch.forEach((card) => docks.get(card).reset());
  const triggers = ScrollTrigger.batch(cards, {
    start,
    end,
    interval: 0.08,
    onEnter: enter,
    onEnterBack: enter,
    onLeave: leave,
    onLeaveBack: leave,
  });

  return () => {
    gsap.ticker.remove(tick);
    triggers.forEach((trigger) => trigger.kill());
    docks.forEach((dock) => dock.destroy());
  };
}
