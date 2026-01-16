import { useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Link } from "react-router-dom";
import ContactDialog from "./ContactDialog";

const HEADER_H = 64;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Nav() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isHidden, setIsHidden] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsHidden(latest > 8);
  });

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };

  const variants = {
    shown: { y: 0, opacity: 1, transition },
    hidden: { y: -HEADER_H, opacity: 0, transition },
  };

  return (
    <motion.header
      className={cx(
        "sd-header fixed top-0 left-0 right-0 z-50 bg-white",
        isHidden && "pointer-events-none",
      )}
      variants={variants}
      initial="shown"
      animate={isHidden ? "hidden" : "shown"}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 rounded-md px-3 py-2 bg-white border border-black/20"
      >
        Skip to content
      </a>

      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3 flex h-full items-center justify-between gap-6 text-xs uppercase tracking-[0.24em] whitespace-nowrap">
            <a href="#top" className="text-black/70 hover:text-black">
              <span className="font-medium">Stage Devices</span>
            </a>

            <nav className="flex items-center gap-5 whitespace-nowrap">
              <a href="#synctimer" className="text-black/60 hover:text-black">
                SyncTimer
              </a>
              <a href="#tenney" className="text-black/60 hover:text-black">
                Tenney
              </a>
              <Link to="/support" className="text-black/60 hover:text-black">
                Support
              </Link>
              <a
                href="#contact"
                className="text-black/60 hover:text-black"
                onClick={(event) => {
                  event.preventDefault();
                  setIsContactOpen(true);
                }}
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </div>
      <ContactDialog open={isContactOpen} onOpenChange={setIsContactOpen} />
    </motion.header>
  );
}
