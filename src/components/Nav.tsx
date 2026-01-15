import type { MouseEvent } from "react";
import { useTui } from "../lib/tuiController";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const tuiAnchorMap: Record<string, string> = {
  "#top": "hero:display",
  "#synctimer": "products:synctimer:start",
  "#tenney": "products:tenney:start",
  "#contact": "contact:start",
};

export default function Nav() {
  const { isTuiEnabled, goToRowById } = useTui();

  const handleAnchorClick = (hash: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isTuiEnabled) return;

    const rowId = tuiAnchorMap[hash];
    if (!rowId) return;

    event.preventDefault();
    goToRowById(rowId);
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  };

  return (
    <header className={cx("sticky top-0 z-50 bg-white")}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 rounded-md px-3 py-2 bg-white border border-black/20"
      >
        Skip to content
      </a>

      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3 flex h-14 items-center justify-between text-xs uppercase tracking-[0.24em]">
            <a href="#top" onClick={handleAnchorClick("#top")} className="text-black/70 hover:text-black">
              <span className="font-medium">Stage Devices</span>
            </a>

            <nav className="flex items-center gap-5">
              <a
                href="#synctimer"
                onClick={handleAnchorClick("#synctimer")}
                className="text-black/60 hover:text-black"
              >
                SyncTimer
              </a>
              <a
                href="#tenney"
                onClick={handleAnchorClick("#tenney")}
                className="text-black/60 hover:text-black"
              >
                Tenney
              </a>
              <a
                href="#contact"
                onClick={handleAnchorClick("#contact")}
                className="text-black/60 hover:text-black"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
