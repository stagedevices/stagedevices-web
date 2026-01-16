function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Nav() {
  return (
    <header className={cx("sd-header sticky top-0 z-50 bg-white")}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 rounded-md px-3 py-2 bg-white border border-black/20"
      >
        Skip to content
      </a>

      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3 flex h-full items-center justify-between text-xs uppercase tracking-[0.24em]">
            <a href="#top" className="text-black/70 hover:text-black">
              <span className="font-medium">Stage Devices</span>
            </a>

            <nav className="flex items-center gap-5">
              <a href="#synctimer" className="text-black/60 hover:text-black">
                SyncTimer
              </a>
              <a href="#tenney" className="text-black/60 hover:text-black">
                Tenney
              </a>
              <a href="#contact" className="text-black/60 hover:text-black">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
