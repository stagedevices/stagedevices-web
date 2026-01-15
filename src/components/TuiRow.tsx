import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTui, type TuiAction, type TuiSection } from "../lib/tuiController";

export type TuiRowProps = {
  id: string;
  text: string;
  className?: string;
  section?: TuiSection;
  action?: TuiAction;
};

const getRowClassName = (className?: string) =>
  ["tui-row", "whitespace-pre-wrap", className].filter(Boolean).join(" ");

export default function TuiRow({ id, text, className, section, action }: TuiRowProps) {
  const {
    registerRow,
    unregisterRow,
    activeRowId,
    charIndex,
    isTuiEnabled,
    movementTick,
  } = useTui();

  const rowRef = useRef<HTMLSpanElement | null>(null);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const cacheRef = useRef<{ centers: number[]; rects: DOMRect[] } | null>(null);

  const chars = useMemo(() => Array.from(text), [text]);

  const buildCache = useCallback(() => {
    const centers: number[] = [];
    const rects: DOMRect[] = [];

    charRefs.current.forEach((span, index) => {
      if (!span) return;
      const rect = span.getBoundingClientRect();
      centers[index] = rect.left + rect.width / 2;
      rects[index] = rect;
    });

    cacheRef.current = { centers, rects };
    return cacheRef.current;
  }, []);

  const getCharCenterX = useCallback(
    (index: number) => {
      if (!chars.length) {
        const rect = rowRef.current?.getBoundingClientRect();
        return rect ? rect.left + rect.width / 2 : null;
      }
      const cache = cacheRef.current ?? buildCache();
      return cache.centers[index] ?? null;
    },
    [buildCache, chars.length],
  );

  const getClosestCharIndex = useCallback(
    (desiredX: number) => {
      if (!chars.length) return 0;
      const cache = cacheRef.current ?? buildCache();
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      cache.centers.forEach((center, index) => {
        if (center == null) return;
        const distance = Math.abs(center - desiredX);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      return closestIndex;
    },
    [buildCache, chars.length],
  );

  const getCharRect = useCallback(
    (index: number) => {
      if (!chars.length) return rowRef.current?.getBoundingClientRect() ?? null;
      const cache = cacheRef.current ?? buildCache();
      return cache.rects[index] ?? rowRef.current?.getBoundingClientRect() ?? null;
    },
    [buildCache, chars.length],
  );

  useEffect(() => {
    cacheRef.current = null;
  }, [text]);

  useEffect(() => {
    const handleResize = () => {
      cacheRef.current = null;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    registerRow({
      id,
      section,
      action,
      text,
      textLength: chars.length,
      ref: rowRef,
      getCharCenterX,
      getClosestCharIndex,
      getCharRect,
    });

    return () => {
      unregisterRow(id);
    };
  }, [
    action,
    chars.length,
    getCharCenterX,
    getCharRect,
    getClosestCharIndex,
    id,
    registerRow,
    section,
    text,
    unregisterRow,
  ]);

  const isActiveRow = isTuiEnabled && activeRowId === id;
  const activeCharIndex = isActiveRow ? charIndex : -1;

  return (
    <span
      ref={rowRef}
      className={getRowClassName(className)}
      data-row-id={id}
      data-section={section}
      role="text"
      aria-label={text}
    >
      {chars.map((char, index) => {
        const distance = Math.abs(index - activeCharIndex);
        const isActive = distance === 0;
        const isNeighbor = !isActive && distance > 0 && distance <= 2;
        const displayChar = char === " " ? " " : char;

        if (isActive) {
          return (
            <motion.span
              key={`${id}-${index}-${movementTick}`}
              ref={(el) => {
                charRefs.current[index] = el;
              }}
              data-char-index={index}
              aria-hidden="true"
              className="tui-char is-active"
              style={{ scaleX: 1.06 }}
              initial={{ scaleY: 1.12 }}
              animate={{ scaleY: 1.06 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              {displayChar}
            </motion.span>
          );
        }

        return (
          <span
            key={`${id}-${index}`}
            ref={(el) => {
              charRefs.current[index] = el;
            }}
            data-char-index={index}
            aria-hidden="true"
            className={["tui-char", isNeighbor ? "is-neighbor" : ""].filter(Boolean).join(" ")}
          >
            {displayChar}
          </span>
        );
      })}
    </span>
  );
}
