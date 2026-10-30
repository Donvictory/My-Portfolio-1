import { gsap } from "gsap";

// The hero intro: a companion carries the whole headline into the real <h1>, word by word,
// then the supporting paragraph and buttons follow. One GSAP timeline drives the companion's
// state (read every frame by Companion.jsx), the carried words and the DOM reveals, so they
// cannot drift apart. Everything is tweened, never set from callbacks, so jumping the
// timeline to its end (skip, reduced motion, arriving mid-page) lands in the final state.

const CHARACTER_HEIGHT_EM = 1.8; // companion height relative to the headline font size
const MIN_CHARACTER_HEIGHT = 62; // keeps it legible (and tappable) on phones
const STACK_SCALE = 0.34; // carried words are about a third size until placed
const BASELINE_EM = 0.242; // Inter's descender: distance from a word box's bottom to its baseline
const LINE_PACE = [1, 0.85, 0.72, 0.62]; // it gets quicker with each line it builds

// full: plays on every load, any screen size · short: page opened below the top, final pose
// only · static: reduced motion, final pose only · none: no WebGL
// ("lite", a plain reveal without the companion, is the fallback when the companion fails)
export function getHeroIntroMode() {
  if (!supportsWebGL()) return "none";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  if (window.scrollY > 0 || window.location.hash) return "short";
  return "full";
}

// Modes in which the headline starts hidden and is revealed by the intro.
export const hidesHeadline = (mode) => mode === "full" || mode === "lite";

export const createCompanionState = () => ({
  x: -1e4, // feet position in overlay pixels
  y: 0,
  height: 100,
  facing: 0, // body yaw: −1 faces left, 0 the viewer, 1 right
  walk: 0, // gait weight; stride follows how far x moves
  carry: 0,
  reach: 0,
  crouch: 0,
  lean: 0,
  squash: 0, // + squash, − stretch
  lookYaw: 0,
  lookPitch: 0,
  surprise: 0,
  happy: 0,
  idle: 0,
  stack: { el: null, x: 0, y: 0, drop: 0, attach: 0, scale: STACK_SCALE },
});

// While the headline is being built, the background scene stays quiet and holds its own
// assembly (CameraRig and Sculpture read this flag); it resumes once the headline is complete.
const holdScene = () => {
  document.documentElement.dataset.heroIntro = "playing";
};
const releaseScene = () => {
  delete document.documentElement.dataset.heroIntro;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// The overlay spans the full viewport width (so the companion can walk in from the edge) and
// the hero's height; it is positioned inside the section and scrolls with it.
export function fitOverlay(section, overlay) {
  const sectionRect = section.getBoundingClientRect();
  Object.assign(overlay.style, {
    left: `${-sectionRect.left}px`,
    width: `${document.documentElement.clientWidth}px`,
    height: `${section.offsetHeight}px`,
  });
  return sectionRect;
}

// Word slots in overlay pixels, grouped into rendered lines. Measured relative to the <h1>,
// so its own entrance transform cancels out.
function measureHero(section, overlay) {
  const sectionRect = fitOverlay(section, overlay);
  const h1 = section.querySelector("h1");
  const h1Rect = h1.getBoundingClientRect();
  const fontSize = parseFloat(getComputedStyle(h1).fontSize);
  const originX = sectionRect.left + h1.offsetLeft - h1Rect.left;
  const originY = h1.offsetTop - h1Rect.top;

  const lines = [];
  for (const el of section.querySelectorAll(".hero-word")) {
    const rect = el.getBoundingClientRect();
    const slot = { el, left: rect.left + originX, top: rect.top + originY, width: rect.width, height: rect.height };
    const line = lines[lines.length - 1];
    if (line && Math.abs(line[0].top - slot.top) < fontSize * 0.3) line.push(slot);
    else lines.push([slot]);
  }

  return {
    h1,
    lines,
    fontSize,
    height: Math.max(fontSize * CHARACTER_HEIGHT_EM, MIN_CHARACTER_HEIGHT),
    width: document.documentElement.clientWidth,
    baseline: (line) => line[0].top + line[0].height - BASELINE_EM * fontSize,
  };
}

const lineEnd = (line) => line[line.length - 1].left + line[line.length - 1].width;
const lineCenter = (line) => (line[0].left + lineEnd(line)) / 2;

// Where the companion rests once the headline is built: on the last line's baseline, clear of
// both the last line and the one above it (it stands taller than a line).
function finalPose(layout) {
  const { lines } = layout;
  const line = lines[lines.length - 1];
  const clearOf = Math.max(...lines.slice(-2).map(lineEnd));
  return {
    x: Math.min(clearOf + 0.5 * layout.height, layout.width - 0.5 * layout.height),
    y: layout.baseline(line),
    height: layout.height,
  };
}

function wordElement(slot, font, extra) {
  const el = document.createElement("span");
  el.textContent = slot.el.textContent;
  Object.assign(el.style, font, { display: "block", whiteSpace: "nowrap" }, extra);
  return el;
}

// A flyer lifts a word off the bundle and lands exactly over the real word's box. The outer
// element carries the vertical travel, the inner one the horizontal travel and scale.
function createFlyer(slot, font) {
  const outer = document.createElement("div");
  Object.assign(outer.style, {
    position: "absolute",
    left: `${slot.left}px`,
    top: `${slot.top}px`,
    width: `${slot.width}px`,
    height: `${slot.height}px`,
    opacity: "0",
  });
  const inner = wordElement(slot, font, { lineHeight: `${slot.height}px`, transformOrigin: "50% 50%" });
  outer.append(inner);
  return { outer, inner };
}

function supportReveal(tl, section, at) {
  const [paragraph, actions] = section.querySelectorAll(".hero-support");
  const hidden = "inset(0% 0% 100% 0%)";
  // Ends unclipped beyond the edges so button shadows and hover lifts are never cut off
  const open = "inset(-30% -5% -60% -5%)";
  tl.addLabel("support", at);
  tl.fromTo(
    paragraph,
    { clipPath: hidden, translate: "0px 14px" },
    { clipPath: open, translate: "0px 0px", duration: 0.8, ease: "power3.out", immediateRender: false },
    "support"
  );
  tl.fromTo(actions, { clipPath: hidden }, { clipPath: open, duration: 0.7, ease: "power3.out", immediateRender: false }, "support+=0.3");
  tl.fromTo(
    actions.children,
    { translate: "0px 18px" },
    { translate: "0px 0px", duration: 0.7, stagger: 0.08, ease: "power3.out", immediateRender: false },
    "support+=0.3"
  );
  tl.set([paragraph, actions], { clipPath: "none" }, "support+=1.3");
}

// Small screens and fallbacks: no companion, the headline settles in, then the rest.
export function createLiteReveal(section) {
  const tl = gsap.timeline({ delay: 0.2 });
  tl.fromTo(section.querySelectorAll(".hero-word"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.05, ease: "power1.out" });
  supportReveal(tl, section, ">-0.2");
  return () => tl.kill();
}

export function createHeroIntro({ section, overlay, propsLayer, companion, mode }) {
  let layout = measureHero(section, overlay);
  const H = layout.height;
  const { lines } = layout;

  const h1Style = getComputedStyle(layout.h1);
  const font = {
    fontFamily: h1Style.fontFamily,
    fontSize: h1Style.fontSize,
    fontWeight: h1Style.fontWeight,
    letterSpacing: h1Style.letterSpacing,
    fontFeatureSettings: h1Style.fontFeatureSettings,
    color: "var(--text-primary)",
  };
  const lineHeight = parseFloat(h1Style.lineHeight) || layout.fontSize * 1.12;
  // The companion builds each line standing a row below it, holding the bundle up near the row
  // it is filling. While the bundle is still tall (3+ lines left) it works two rows down, so the
  // bundle never rises over the label above the headline.
  const groundFor = (l) => layout.baseline(lines[l]) + (lines.length - l > 2 ? 2 : 1) * lineHeight;

  // The bundle: the whole headline in its rendered lines, small, anchored at its base.
  // Each line's row collapses once placed, so the bundle shrinks from the top.
  const stack = document.createElement("div");
  Object.assign(stack.style, {
    position: "absolute",
    left: "0",
    top: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: h1Style.fontSize,
    lineHeight: h1Style.lineHeight,
    transformOrigin: "50% 100%",
    opacity: "0",
    willChange: "transform",
  });
  const rows = lines.map((line) => {
    const row = document.createElement("div");
    Object.assign(row.style, { display: "flex", alignItems: "baseline", gap: "0.28em" });
    const words = line.map((slot) => wordElement(slot, font));
    row.append(...words);
    return { row, words };
  });
  stack.append(...rows.map(({ row }) => row));
  const flyers = lines.map((line) => line.map((slot) => createFlyer(slot, font)));
  propsLayer.append(stack, ...flyers.flat().map((flyer) => flyer.outer));
  companion.stack.el = stack;
  const bundleWidth = stack.offsetWidth * STACK_SCALE;

  const tl = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });
  let t = 0;
  let cursorX = layout.width + H;
  let cursorY = groundFor(0);

  const walkTo = (x, speed, ease = "sine.inOut") => {
    const duration = Math.max(0.3, Math.abs(x - cursorX) / speed);
    tl.to(companion, { walk: 1, duration: 0.2, ease: "power1.out" }, t);
    tl.to(companion, { x, duration, ease }, t);
    tl.to(companion, { walk: 0, duration: 0.25, ease: "power1.in" }, t + duration - 0.2);
    cursorX = x;
    t += duration;
  };

  // Anticipation, an arc that clears the higher of the two lines, a squash on landing
  const hopTo = (x, y) => {
    tl.to(companion, { crouch: 0.85, duration: 0.16, ease: "power2.in" }, t);
    tl.to(companion, { crouch: 0, squash: -0.1, duration: 0.14, ease: "power2.out" }, t + 0.16);
    tl.to(companion, { x, duration: 0.4, ease: "sine.inOut" }, t + 0.18);
    tl.to(
      companion,
      {
        keyframes: [
          { y: Math.min(cursorY, y) - 0.3 * H, duration: 0.2, ease: "power2.out" },
          { y, duration: 0.2, ease: "power2.in" },
        ],
      },
      t + 0.18
    );
    tl.to(companion, { squash: 0.12, duration: 0.07, ease: "power1.out" }, t + 0.58);
    tl.to(companion, { squash: 0, duration: 0.3, ease: "power2.out" }, t + 0.65);
    cursorX = x;
    cursorY = y;
    t += 0.72;
  };

  const placeWord = (slot, word, { outer, inner }, pace) => {
    // Start from wherever the word sits in the bundle at that moment (it follows the hands)
    const fromBundle = () => {
      const o = overlay.getBoundingClientRect();
      const r = word.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - o.left - (slot.left + slot.width / 2),
        y: r.top + r.height / 2 - o.top - (slot.top + slot.height / 2),
      };
    };
    const flight = 0.45 * pace;
    const lookYaw = gsap.utils.clamp(-0.6, 0.6, (slot.left + slot.width / 2 - cursorX) / (3 * H));
    // A small upward push while looking at the word's spot
    tl.to(companion, { lookYaw, lookPitch: -0.3, squash: -0.05, duration: 0.18, ease: "power2.out" }, t);
    tl.set(word, { opacity: 0 }, t + 0.1);
    tl.set(outer, { opacity: 1 }, t + 0.1);
    tl.fromTo(
      inner,
      { x: () => fromBundle().x, scale: STACK_SCALE },
      { x: 0, scale: 1, duration: flight, ease: "power2.out", immediateRender: false },
      t + 0.1
    );
    tl.fromTo(outer, { y: () => fromBundle().y }, { y: 0, duration: flight, ease: "power2.out", immediateRender: false }, t + 0.1);
    // The flyer lands exactly on the real word, which takes over
    tl.set(slot.el, { opacity: 1 }, t + 0.1 + flight);
    tl.set(outer, { opacity: 0 }, t + 0.1 + flight);
    tl.to(companion, { squash: 0.02, duration: 0.2 }, t + 0.28);
    t += 0.45 * pace;
  };

  // Start: just off the right edge, on the row below the first line, facing left. The bundle
  // lands past the first line's end, or against the right edge when the line fills the screen.
  const stackX = Math.min(lineEnd(lines[0]) + 0.4 * H + bundleWidth / 2, layout.width - bundleWidth / 2 - 0.4 * H);
  tl.set(companion, { x: cursorX, y: cursorY, height: H, facing: -1 }, 0);
  tl.set(companion.stack, { x: stackX, y: cursorY, drop: -0.8 * H, attach: 0 }, 0);

  // Stage 1 · entrance: walk in, settle, look around, notice the headline
  walkTo(Math.min(stackX + bundleWidth / 2 + 0.9 * H, layout.width - 0.7 * H), 3.2 * H, "power2.out");
  tl.to(companion, { squash: 0.07, duration: 0.1, ease: "power2.out" }, t);
  tl.to(companion, { squash: 0, duration: 0.3, ease: "power2.inOut" }, t + 0.1);
  t += 0.2;
  tl.to(companion, { facing: 0, duration: 0.35 }, t);
  tl.to(companion, { lookYaw: 0.5, duration: 0.3 }, t + 0.05);
  tl.to(companion, { lookYaw: -0.45, duration: 0.4 }, t + 0.4);
  t += 0.8;
  tl.to(companion, { facing: -0.7, lookYaw: -0.35, lookPitch: -0.15, duration: 0.3, ease: "power2.out" }, t);
  tl.to(companion, { surprise: 1, squash: -0.06, duration: 0.12, ease: "power2.out" }, t + 0.08);
  tl.to(companion, { surprise: 0.35, squash: 0, duration: 0.4 }, t + 0.24);
  t += 0.35;

  // Stage 2 · discovery: the headline, bundled, drops onto the ground beside it
  tl.fromTo(stack, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, t);
  tl.to(companion.stack, { drop: 0, duration: 0.4, ease: "power2.in" }, t);
  tl.to(companion, { lookPitch: 0.3, lookYaw: -0.15, duration: 0.35 }, t + 0.2);
  tl.to(companion, { surprise: 0.8, duration: 0.1 }, t + 0.4);
  tl.to(companion, { surprise: 0.2, duration: 0.4 }, t + 0.5);
  t += 0.65;
  tl.to(companion, { facing: -1, duration: 0.25 }, t);
  walkTo(stackX, 2.8 * H);
  tl.to(companion, { facing: 0, duration: 0.25 }, t);
  t += 0.2;

  // Stage 3 · pick up: crouch, grip, gather, lift overhead with the weight showing
  tl.to(companion, { crouch: 1, reach: 1, lookPitch: 0.35, duration: 0.32, ease: "power2.inOut" }, t);
  tl.to(companion.stack, { attach: 1, duration: 0.26, ease: "power2.inOut" }, t + 0.22);
  t += 0.34;
  tl.to(companion, { crouch: 1.15, duration: 0.12, ease: "power1.in" }, t);
  tl.to(
    companion,
    { crouch: 0, reach: 0, carry: 1, lookPitch: -0.2, squash: -0.07, duration: 0.45, ease: "power2.inOut" },
    t + 0.12
  );
  tl.to(companion, { squash: 0.04, lookPitch: 0, duration: 0.25, ease: "power2.out" }, t + 0.57);
  t += 0.7;
  tl.to(companion, { facing: -1, duration: 0.25 }, t);
  walkTo(lineCenter(lines[0]), 3 * H);

  // Stage 4 · construction: every word into its real position, line by line, left to right.
  // Between lines the companion hops down a row with what is left of the bundle.
  lines.forEach((line, l) => {
    const pace = LINE_PACE[Math.min(l, LINE_PACE.length - 1)];
    if (l > 0) hopTo(lineCenter(line), groundFor(l));
    tl.to(companion, { facing: 0.15, duration: 0.25 }, t);
    line.forEach((slot, i) => placeWord(slot, rows[l].words[i], flyers[l][i], pace));
    tl.set(rows[l].row, { display: "none" }, t + 0.1);
  });
  tl.set(stack, { opacity: 0 }, t);

  // Stage 6 · reaction: a small cheer, a happy squint, a nod at the finished headline
  tl.to(companion, { carry: 0.7, happy: 1, lookYaw: -0.4, lookPitch: -0.35, squash: -0.05, duration: 0.25, ease: "power2.out" }, t);
  tl.to(companion, { carry: 0, squash: 0.03, duration: 0.4, ease: "power2.inOut" }, t + 0.35);
  tl.to(companion, { lookPitch: 0.15, duration: 0.14 }, t + 0.7);
  tl.to(companion, { lookPitch: 0, lookYaw: 0, duration: 0.2 }, t + 0.84);
  t += 1.0;

  // Then up beside the finished headline; the background scene resumes and the
  // supporting content follows (Stage 5)
  const resting = finalPose(layout);
  tl.call(releaseScene, null, t);
  hopTo(resting.x, resting.y);
  supportReveal(tl, section, t - 0.2);
  tl.to(companion, { facing: 0, happy: 0.25, duration: 0.3 }, t - 0.2);
  tl.set(companion, { idle: 1 }, t);

  // Once the intro is over, tapping or clicking the companion gets a reaction: it looks at the
  // pointer, then hops, spins or cheers, in turn. It sits behind the text, so the hit test is
  // done by position; links and buttons keep their own clicks.
  let reaction = null;
  let reactionCount = 0;
  const pointerX = (event) => event.clientX - overlay.getBoundingClientRect().left;
  const isOnCompanion = (event) => {
    if (tl.progress() < 1 || event.target.closest?.("a, button, input, textarea, select, label")) return false;
    const y = event.clientY - overlay.getBoundingClientRect().top;
    return (
      Math.abs(pointerX(event) - companion.x) < 0.4 * companion.height &&
      y > companion.y - companion.height &&
      y < companion.y + 0.08 * companion.height
    );
  };
  const react = (x) => {
    if (reaction?.isActive()) return;
    const kind = reactionCount++ % 3; // 0 hop · 1 spin · 2 cheer
    const restY = companion.y;
    const rise = (kind === 0 ? 0.45 : 0.3) * companion.height;
    reaction = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    reaction.to(companion, { lookYaw: gsap.utils.clamp(-0.6, 0.6, (x - companion.x) / (2 * companion.height)), surprise: 1, duration: 0.12, ease: "power2.out" }, 0);
    reaction.to(companion, { crouch: 0.8, duration: 0.14, ease: "power2.in" }, 0.08);
    reaction.to(companion, { crouch: 0, squash: -0.12, duration: 0.12, ease: "power2.out" }, 0.22);
    reaction.to(
      companion,
      {
        keyframes: [
          { y: restY - rise, duration: 0.24, ease: "power2.out" },
          { y: restY, duration: 0.22, ease: "power2.in" },
        ],
      },
      0.24
    );
    if (kind === 1) {
      reaction.fromTo(companion, { facing: 0 }, { facing: Math.PI * 2, duration: 0.46, ease: "power1.inOut" }, 0.24);
      reaction.set(companion, { facing: 0 }, 0.7);
    }
    if (kind === 2) {
      reaction.to(companion, { carry: 0.7, duration: 0.2, ease: "power2.out" }, 0.24);
      reaction.to(companion, { carry: 0, duration: 0.4 }, 0.75);
    }
    reaction.to(companion, { squash: 0.12, duration: 0.07 }, 0.7);
    reaction.to(companion, { squash: 0, surprise: 0, happy: 1, duration: 0.35, ease: "power2.out" }, 0.77);
    reaction.to(companion, { happy: 0.25, lookYaw: 0, duration: 0.5 }, 1.4);
  };
  const onPoke = (event) => isOnCompanion(event) && react(pointerX(event));
  const onHover = (event) => {
    if (event.pointerType === "mouse") section.style.cursor = isOnCompanion(event) ? "pointer" : "";
  };

  // Skip: any input finishes the intro at once; the companion fades back in at rest
  const inputs = ["wheel", "touchstart", "keydown", "pointerdown"];
  const finish = () => {
    if (tl.progress() === 1) return;
    detach();
    releaseScene();
    overlay.style.opacity = "0";
    tl.progress(1);
    gsap.to(overlay, { opacity: 1, duration: 0.5, delay: 0.1 });
  };
  const onScroll = () => window.scrollY > 4 && finish();
  const detach = () => {
    inputs.forEach((type) => window.removeEventListener(type, finish));
    window.removeEventListener("scroll", onScroll);
  };

  // After a resize the line breaks may move: finish, then re-measure the resting spot
  let resizeTimer;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      finish();
      layout = measureHero(section, overlay);
      gsap.set(companion, finalPose(layout));
    }, 150);
  };
  window.addEventListener("resize", onResize);

  if (mode === "full") {
    inputs.forEach((type) => window.addEventListener(type, finish, { passive: true }));
    window.addEventListener("scroll", onScroll, { passive: true });
    tl.eventCallback("onComplete", detach);
    holdScene();
    tl.play();
  } else {
    tl.progress(1);
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.6 });
  }
  // Registered after the skip listeners, so a tap during the intro finishes it first
  window.addEventListener("pointerdown", onPoke);
  section.addEventListener("pointermove", onHover);

  return () => {
    detach();
    releaseScene();
    window.removeEventListener("pointerdown", onPoke);
    section.removeEventListener("pointermove", onHover);
    section.style.removeProperty("cursor");
    reaction?.kill();
    clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    tl.revert();
    stack.remove();
    flyers.flat().forEach((flyer) => flyer.outer.remove());
    companion.stack.el = null;
  };
}
