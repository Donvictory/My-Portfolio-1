import { useEffect } from "react";
import { gsap } from "gsap";

// "animate": staggered word reveal on first load. "static": show immediately.
export function getHeroRevealMode() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  if (window.scrollY > 0 || window.location.hash) return "static";
  return "animate";
}

export default function useHeroReveal(sectionRef, mode) {
  useEffect(() => {
    const section = sectionRef.current;
    if (mode !== "animate" || !section) return;

    const words = section.querySelectorAll(".hero-word");
    const support = section.querySelectorAll(".hero-support");
    let tl;
    let cancelled = false;

    // Wait for the display font so words don't reflow mid-animation.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      tl = gsap.timeline({ delay: 0.25 });
      tl.fromTo(
        words,
        { opacity: 0, yPercent: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "filter,transform",
        }
      );
      // Support copy uses clip + translate (not opacity) so it doesn't fight the scroll fade on .hero-anim.
      tl.fromTo(
        support,
        { clipPath: "inset(0% 0% 100% 0%)", translate: "0px 16px" },
        {
          clipPath: "inset(-30% -5% -60% -5%)",
          translate: "0px 0px",
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.7"
      );
      tl.set(support, { clipPath: "none" });
    });

    return () => {
      cancelled = true;
      tl?.kill();
      gsap.set(words, { opacity: 1, clearProps: "filter,transform" });
      gsap.set(support, { clipPath: "none", translate: "0px 0px" });
    };
  }, [sectionRef, mode]);
}
