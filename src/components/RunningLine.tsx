import { useEffect, useMemo, useRef, useState } from "react";

const PICK_A =
  "Built for real rooms and real people · Precision without ceremony · Craft over noise ·";
const PICK_B =
  "SyncTimer: Countdown + Sync · QR / Rooms · Cue Sheets · Tenney: Lattice · Tuner · Save / Export ·";

const SWITCH_INTERVAL_MS = 14000;
const PICK_B_DURATION_MS = 12000;

type RunningLineProps = {
  className?: string;
};

function RunningLine({ className }: RunningLineProps) {
  const [mode, setMode] = useState<"A" | "B">("A");
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMode("B");
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setMode("A");
      }, PICK_B_DURATION_MS);
    }, SWITCH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const content = mode === "A" ? PICK_A : PICK_B;

  const tokens = useMemo(() => {
    const hasTrailingSeparator = content.trim().endsWith("·");
    const parts = content
      .split("·")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    const pieces: { text: string; showSeparator: boolean }[] = [];
    parts.forEach((part, index) => {
      pieces.push({ text: part, showSeparator: index < parts.length - 1 });
    });

    if (hasTrailingSeparator) {
      const lastPiece = pieces[pieces.length - 1];
      if (lastPiece) {
        lastPiece.showSeparator = true;
      }
    }

    return pieces;
  }, [content]);

  const renderTokens = (keyPrefix: string) => (
    <span className="sd-marquee__text">
      {tokens.map((token, index) => (
        <span key={`${keyPrefix}-${token.text}-${index}`} className="sd-token">
          <span className="sd-text">{token.text}</span>
          {token.showSeparator ? (
            <span className="sd-sep" aria-hidden="true">
              {" "}·{" "}
            </span>
          ) : null}
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={`sd-marquee${className ? ` ${className}` : ""}`}
      data-hovered={isHovered ? "true" : "false"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sd-marquee__rail" aria-hidden="true" />
      <div className="sd-marquee__track">
        <div className="sd-marquee__move">
          <div className="sd-marquee__strip text-xs tracking-[0.28em]">
            {renderTokens("primary")}
          </div>
          <div
            className="sd-marquee__strip text-xs tracking-[0.28em]"
            aria-hidden="true"
          >
            {renderTokens("duplicate")}
          </div>
        </div>
      </div>
      <span className="sr-only">{content}</span>
    </div>
  );
}

export default RunningLine;
