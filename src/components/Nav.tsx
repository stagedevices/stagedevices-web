function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Nav() {
  return (
    <header className={cx("sticky top-0 z-50 bg-white", "border-b border-black/10")}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 rounded-md px-3 py-2 bg-white border border-black/20"
      >
        Skip to content
      </a>

      <div className="mx-auto max-w-[72ch] px-6">
        <div className="flex h-14 items-center justify-between">
          <a href="#top" className="text-xs uppercase tracking-[0.24em]">
            <span className="font-medium">Stage Devices</span>
          </a>

          <nav className="flex items-center gap-5 text-xs uppercase tracking-[0.24em]">
            <a
              href="#synctimer"
              className="text-black/60 hover:text-black underline-offset-[6px] hover:underline decoration-black/30 decoration-[0.5px]"
            >
              SyncTimer
            </a>
            <a
              href="#tenney"
              className="text-black/60 hover:text-black underline-offset-[6px] hover:underline decoration-black/30 decoration-[0.5px]"
            >
              Tenney
            </a>
            <a
              href="#contact"
              className="text-black/60 hover:text-black underline-offset-[6px] hover:underline decoration-black/30 decoration-[0.5px]"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
