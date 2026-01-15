import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const sectionDefinitions = [
  { id: "hero", label: "Hero" },
  { id: "principles", label: "Principles" },
  { id: "products", label: "Products" },
  { id: "synctimer", label: "SyncTimer" },
  { id: "tenney", label: "Tenney" },
  { id: "why", label: "Why" },
  { id: "contact", label: "Contact" },
];

const navLinks = [
  { href: "#synctimer", label: "SyncTimer" },
  { href: "#tenney", label: "Tenney" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const reduceMotion = useReducedMotion();
  const defaultLabel = sectionDefinitions[0]?.label ?? "Hero";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeLabel, setActiveLabel] = useState(defaultLabel);

  const transition = useMemo(
    () =>
      reduceMotion
        ? { duration: 0 }
        : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    [reduceMotion],
  );

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const shouldCollapse = !entry.isIntersecting || entry.intersectionRatio < 0.25;
        setIsCollapsed(shouldCollapse);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const visibility = new Map<string, number>();
    const sections = sectionDefinitions
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target instanceof HTMLElement) {
            visibility.set(entry.target.id, entry.intersectionRatio);
          }
        });

        let bestId: string | null = null;
        let bestRatio = 0;

        visibility.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) {
          const match = sectionDefinitions.find((section) => section.id === bestId);
          if (match) {
            setActiveLabel(match.label);
          }
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 rounded-md px-3 py-2 bg-white border border-black/20"
      >
        Skip to content
      </a>

      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3 py-4">
            <AnimatePresence mode="wait" initial={false}>
              {isCollapsed ? (
                <motion.div
                  key="collapsed"
                  initial={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={transition}
                  className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-black/45"
                >
                  <a href="#top" className="u-link text-black/70">
                    <span className="font-medium">Stage Devices</span>
                  </a>
                  <nav className="flex flex-wrap items-center gap-6 text-black/55">
                    {navLinks.map((link) => (
                      <a key={link.href} href={link.href} className="u-link">
                        {link.label}
                      </a>
                    ))}
                  </nav>
                  <span className="text-black/45">{activeLabel}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={transition}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-black/45">
                    <a href="#top" className="u-link text-black/70">
                      <span className="font-medium">Stage Devices</span>
                    </a>
                    <span className="text-black/45">SD / 01</span>
                  </div>
                  <nav className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.28em] text-black/55">
                    {navLinks.map((link) => (
                      <a key={link.href} href={link.href} className="u-link">
                        {link.label}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
