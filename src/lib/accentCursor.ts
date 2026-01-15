export const installAccentCursorDot = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const mediaQuery = window.matchMedia("(pointer: fine) and (hover: hover)");
  if (!mediaQuery.matches) return;

  if (document.getElementById("sd-cursor-dot")) return;

  const dot = document.createElement("div");
  dot.id = "sd-cursor-dot";
  document.body.appendChild(dot);

  let x = 0;
  let y = 0;
  let rafId = 0;
  let isPointerInside = true;
  let isScrolling = false;
  let scrollTimeout: number | undefined;

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updatePosition = () => {
    rafId = 0;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
  };

  const showDot = () => {
    if (isScrolling || !isPointerInside) return;
    dot.style.opacity = "1";
  };

  const hideDot = () => {
    dot.style.opacity = "0";
  };

  const handleMove = (event: PointerEvent) => {
    x = event.clientX;
    y = event.clientY;

    if (!rafId) {
      rafId = window.requestAnimationFrame(updatePosition);
    }

    showDot();
  };

  const handleLeave = () => {
    isPointerInside = false;
    hideDot();
  };

  const handleEnter = () => {
    isPointerInside = true;
    showDot();
  };

  const getLinkTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return null;
    return target.closest("a, button.u-link, a.u-link, [role='link'], .u-link");
  };

  const handlePointerOver = (event: PointerEvent) => {
    const linkTarget = getLinkTarget(event.target);
    if (linkTarget) {
      dot.classList.add("is-link-hover");
    }
  };

  const handlePointerOut = (event: PointerEvent) => {
    const linkTarget = getLinkTarget(event.target);
    if (!linkTarget) return;
    if (event.relatedTarget instanceof Node && linkTarget.contains(event.relatedTarget)) return;
    dot.classList.remove("is-link-hover");
  };

  const handleScroll = () => {
    isScrolling = true;
    hideDot();

    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout);
    }

    scrollTimeout = window.setTimeout(() => {
      isScrolling = false;
      showDot();
    }, 120);
  };

  if (reduceMotionQuery.matches) {
    dot.classList.remove("is-link-hover");
  }

  window.addEventListener("pointermove", handleMove, { passive: true });
  window.addEventListener("pointerleave", handleLeave);
  window.addEventListener("pointerenter", handleEnter);
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("pointerover", handlePointerOver, { passive: true, capture: true });
  document.addEventListener("pointerout", handlePointerOut, { passive: true, capture: true });
};
