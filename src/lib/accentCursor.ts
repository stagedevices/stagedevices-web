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
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
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

  window.addEventListener("pointermove", handleMove, { passive: true });
  window.addEventListener("pointerleave", handleLeave);
  window.addEventListener("pointerenter", handleEnter);
};
