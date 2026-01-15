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

  const updatePosition = () => {
    rafId = 0;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;
  };

  const handleMove = (event: PointerEvent) => {
    x = event.clientX;
    y = event.clientY;

    if (!rafId) {
      rafId = window.requestAnimationFrame(updatePosition);
    }

    if (dot.style.opacity !== "1") {
      dot.style.opacity = "1";
    }
  };

  const handleLeave = () => {
    dot.style.opacity = "0";
  };

  const handleEnter = () => {
    dot.style.opacity = "1";
  };

  const handlePointerOver = (event: PointerEvent) => {
    const target = event.target as Element | null;
    if (!target) return;
    if (target.closest("a, button, [role='button']")) {
      dot.classList.add("is-hovering");
    }
  };

  const handlePointerOut = (event: PointerEvent) => {
    const related = event.relatedTarget as Element | null;
    if (related?.closest("a, button, [role='button']")) return;
    dot.classList.remove("is-hovering");
  };

  window.addEventListener("pointermove", handleMove, { passive: true });
  window.addEventListener("pointerleave", handleLeave);
  window.addEventListener("pointerenter", handleEnter);
  window.addEventListener("pointerover", handlePointerOver);
  window.addEventListener("pointerout", handlePointerOut);
};
