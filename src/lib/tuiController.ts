import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

export type TuiSection = "hero" | "principles" | "products" | "why" | "contact";

export type TuiAction =
  | { type: "download"; url: string }
  | { type: "mailto"; url: string }
  | null;

export type TuiRowMeta = {
  id: string;
  section?: TuiSection;
  action?: TuiAction;
  text: string;
  textLength: number;
  ref: React.RefObject<HTMLElement | null>;
  getCharCenterX: (index: number) => number | null;
  getClosestCharIndex: (desiredX: number) => number;
  getCharRect: (index: number) => DOMRect | null;
};

type TuiContextValue = {
  isTuiEnabled: boolean;
  rows: TuiRowMeta[];
  rowIndex: number;
  charIndex: number;
  desiredX: number | null;
  activeRowId: string | null;
  movementTick: number;
  cameraY: MotionValue<number>;
  registerRow: (row: TuiRowMeta) => void;
  unregisterRow: (id: string) => void;
  goToRowById: (id: string) => void;
  moveRows: (delta: number) => void;
  activate: () => void;
};

const TuiContext = createContext<TuiContextValue | null>(null);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hashMap: Record<string, string> = {
  "hero:display": "#top",
  "products:start": "#products",
  "products:synctimer:start": "#synctimer",
  "products:tenney:start": "#tenney",
  "contact:start": "#contact",
};

export function TuiProvider({ children }: PropsWithChildren) {
  const [isTuiEnabled, setIsTuiEnabled] = useState(false);
  const [rows, setRows] = useState<TuiRowMeta[]>([]);
  const rowsRef = useRef<TuiRowMeta[]>([]);

  const [rowIndex, setRowIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [desiredX, setDesiredX] = useState<number | null>(null);
  const desiredXRef = useRef<number | null>(null);
  const rowIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const [movementTick, setMovementTick] = useState(0);

  const cameraTarget = useMotionValue(0);
  const cameraY = useSpring(cameraTarget, { stiffness: 260, damping: 36, mass: 0.9 });

  useEffect(() => {
    rowIndexRef.current = rowIndex;
  }, [rowIndex]);

  useEffect(() => {
    charIndexRef.current = charIndex;
  }, [charIndex]);

  useEffect(() => {
    desiredXRef.current = desiredX;
  }, [desiredX]);

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(pointer: fine) and (hover: hover)");
    const update = () => setIsTuiEnabled(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  const setDesiredXValue = useCallback((value: number | null) => {
    desiredXRef.current = value;
    setDesiredX(value);
  }, []);

  const registerRow = useCallback((row: TuiRowMeta) => {
    setRows((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === row.id);
      if (existingIndex !== -1) {
        const next = [...prev];
        next[existingIndex] = row;
        return next;
      }
      return [...prev, row];
    });
  }, []);

  const unregisterRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const moveToIndex = useCallback(
    (nextIndex: number) => {
      const rowsSnapshot = rowsRef.current;
      if (!rowsSnapshot.length) return;

      const clampedIndex = clamp(nextIndex, 0, rowsSnapshot.length - 1);
      const currentIndex = rowIndexRef.current;
      if (clampedIndex === currentIndex) return;

      const currentRow = rowsSnapshot[currentIndex];
      let resolvedDesiredX = desiredXRef.current;
      if (resolvedDesiredX == null && currentRow) {
        const currentChar = clamp(
          charIndexRef.current,
          0,
          Math.max(0, currentRow.textLength - 1),
        );
        resolvedDesiredX = currentRow.getCharCenterX(currentChar);
        setDesiredXValue(resolvedDesiredX ?? 0);
      }

      const targetRow = rowsSnapshot[clampedIndex];
      const nextCharIndex = targetRow
        ? targetRow.getClosestCharIndex(resolvedDesiredX ?? 0)
        : 0;

      setRowIndex(clampedIndex);
      setCharIndex(nextCharIndex);
      setMovementTick((tick) => tick + 1);
    },
    [setDesiredXValue],
  );

  const moveRows = useCallback(
    (delta: number) => {
      if (!rowsRef.current.length) return;
      moveToIndex(rowIndexRef.current + delta);
    },
    [moveToIndex],
  );

  const goToRowById = useCallback(
    (id: string) => {
      const rowsSnapshot = rowsRef.current;
      const index = rowsSnapshot.findIndex((row) => row.id === id);
      if (index === -1) return;

      const row = rowsSnapshot[index];
      if (!row) return;
      const nextDesiredX = row.getCharCenterX(0) ?? desiredXRef.current ?? 0;

      setDesiredXValue(nextDesiredX);
      setRowIndex(index);
      setCharIndex(0);
      setMovementTick((tick) => tick + 1);
    },
    [setDesiredXValue],
  );

  const activate = useCallback(() => {
    const rowsSnapshot = rowsRef.current;
    const row = rowsSnapshot[rowIndexRef.current];
    if (!row || !row.action) return;

    if (row.action.type === "download") {
      window.open(row.action.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (row.action.type === "mailto") {
      window.location.href = row.action.url;
    }
  }, []);

  useEffect(() => {
    if (!isTuiEnabled) {
      cameraTarget.set(0);
      return;
    }

    const rowsSnapshot = rowsRef.current;
    const row = rowsSnapshot[rowIndex];
    if (!row) return;

    const raf = window.requestAnimationFrame(() => {
      const rect = row.getCharRect(charIndex) ?? row.ref.current?.getBoundingClientRect() ?? null;
      if (!rect) return;

      const centerY = rect.top + rect.height / 2;
      const vh = window.innerHeight || 1;
      const minBand = vh * 0.35;
      const maxBand = vh * 0.65;

      let target = cameraTarget.get();
      if (centerY < minBand) {
        target = target + (minBand - centerY);
      } else if (centerY > maxBand) {
        target = target - (centerY - maxBand);
      }

      if (target !== cameraTarget.get()) {
        cameraTarget.set(target);
      }
    });

    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, [cameraTarget, charIndex, isTuiEnabled, rowIndex]);

  useEffect(() => {
    if (!isTuiEnabled) return;

    const activeRow = rows[rowIndex];
    if (!activeRow) return;

    const hash = hashMap[activeRow.id];
    if (!hash) return;

    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }, [isTuiEnabled, rowIndex, rows]);

  useEffect(() => {
    if (!isTuiEnabled) return;

    const accumRef = { current: 0 };
    const velocityRef = { current: 0 };
    const lastWheelTs = { current: 0 };
    const momentumRef = { current: 0 };
    const isSelectingRef = { current: false };
    const maybeSelectingRef = { current: false };

    const STEP = 40;
    const MAX_BATCH = 8;
    const FRICTION = 0.84;
    const MIN_VELOCITY = 0.25;

    const syncSelectionState = () => {
      const selection = window.getSelection();
      if (!selection) {
        isSelectingRef.current = false;
        return;
      }
      const hasSelection = selection.toString().length > 0;
      isSelectingRef.current = hasSelection;
    };

    const handleSelectionChange = () => {
      if (!maybeSelectingRef.current) return;
      syncSelectionState();
    };

    const handlePointerDown = (event: PointerEvent) => {
      const main = document.getElementById("main");
      if (!main) return;
      if (main.contains(event.target as Node)) {
        maybeSelectingRef.current = true;
      }
    };

    const handlePointerUp = () => {
      maybeSelectingRef.current = false;
      syncSelectionState();
      if (!window.getSelection()?.toString()) {
        isSelectingRef.current = false;
      }
    };

    const stepFromAccum = () => {
      let moved = 0;
      while (Math.abs(accumRef.current) >= STEP && moved < MAX_BATCH) {
        const direction = accumRef.current > 0 ? 1 : -1;
        moveRows(direction);
        accumRef.current -= STEP * direction;
        moved += 1;
      }
    };

    const momentumStep = () => {
      velocityRef.current *= FRICTION;
      if (Math.abs(velocityRef.current) < MIN_VELOCITY) {
        momentumRef.current = 0;
        return;
      }
      accumRef.current += velocityRef.current;
      stepFromAccum();
      momentumRef.current = window.requestAnimationFrame(momentumStep);
    };

    const startMomentum = () => {
      if (momentumRef.current) return;
      momentumRef.current = window.requestAnimationFrame(momentumStep);
    };

    const handleWheel = (event: WheelEvent) => {
      if (isSelectingRef.current) return;
      event.preventDefault();

      accumRef.current += event.deltaY;
      velocityRef.current = event.deltaY;
      lastWheelTs.current = event.timeStamp;

      stepFromAccum();
      startMomentum();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "j") {
        event.preventDefault();
        moveRows(1);
        return;
      }

      if (event.key === "k") {
        event.preventDefault();
        moveRows(-1);
        return;
      }

      if (event.key === "g") {
        event.preventDefault();
        moveToIndex(0);
        return;
      }

      if (event.key === "G") {
        event.preventDefault();
        moveToIndex(rowsRef.current.length - 1);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        activate();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("selectionchange", handleSelectionChange);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      if (momentumRef.current) {
        window.cancelAnimationFrame(momentumRef.current);
      }
    };
  }, [activate, isTuiEnabled, moveRows, moveToIndex]);

  useEffect(() => {
    if (!rows.length) return;
    if (desiredXRef.current != null) return;

    const firstRow = rows[0];
    if (!firstRow) return;
    const initialX = firstRow.getCharCenterX(0) ?? 0;
    setDesiredXValue(initialX);
  }, [rows, setDesiredXValue]);

  useEffect(() => {
    if (!rows.length) return;
    if (rowIndex < rows.length) return;
    setRowIndex(rows.length - 1);
  }, [rowIndex, rows.length]);

  const activeRowId = rows[rowIndex]?.id ?? null;

  const value = useMemo(
    () => ({
      isTuiEnabled,
      rows,
      rowIndex,
      charIndex,
      desiredX,
      activeRowId,
      movementTick,
      cameraY,
      registerRow,
      unregisterRow,
      goToRowById,
      moveRows,
      activate,
    }),
    [
      activate,
      cameraY,
      charIndex,
      desiredX,
      goToRowById,
      isTuiEnabled,
      movementTick,
      registerRow,
      rowIndex,
      rows,
      unregisterRow,
    ],
  );

  return createElement(TuiContext.Provider, { value }, children);
}

export function useTui() {
  const context = useContext(TuiContext);
  if (!context) {
    throw new Error("useTui must be used within TuiProvider");
  }
  return context;
}
