import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Header from "../components/Header";
import RunningLine from "../components/RunningLine";
import { Kicker, Reveal, WordReveal } from "../components/Reveal";

const SYNC_TIMER_URL = "https://synctimerapp.com";
const TENNEY_URL = "https://tenneyapp.com";
const SYNC_TIMER_VERSION = "v0.9"; // Placeholder until a release version is confirmed.
const TENNEY_VERSION = "v0.9"; // Placeholder until a release version is confirmed.

const products = [
  {
    id: "synctimer",
    name: "SyncTimer",
    wordmarkSrc: "/assets/wordmark_synctimer.png",
    wordmarkAlt: "SyncTimer wordmark",
    catalogId: "SDEV-001",
    ctaLabel: "Get SyncTimer",
    sentence: "A timer for ensemble performance.",
    specLine: "Countdown / Sync / Cue Sheets",
    version: SYNC_TIMER_VERSION,
    platform: "iOS / iPadOS",
    url: SYNC_TIMER_URL,
  },
  {
    id: "tenney",
    name: "Tenney",
    wordmarkSrc: "/assets/wordmark_tenney.png",
    wordmarkAlt: "Tenney wordmark",
    catalogId: "SDEV-002",
    ctaLabel: "Get Tenney",
    sentence: "A lattice-first tuning environment.",
    specLine: "Lattice / Tuner / Save/Export",
    version: TENNEY_VERSION,
    platform: "iOS / iPadOS",
    url: TENNEY_URL,
  },
];

export default function Home() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const [accentValue, setAccentValue] = useState("");
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [arrivedProductIds, setArrivedProductIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    if (value) {
      setAccentValue(value);
    }
  }, []);

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const handleArrive = (id: string) => {
    setArrivedProductIds((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const getMarginaliaMotion = (isVisible: boolean) => {
    const transition = reduceMotion
      ? { duration: 0 }
      : { duration: 0.35, ease: [0.16, 0.84, 0.44, 1] as const };

    return {
      initial: { opacity: 0, y: 6 },
      animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
      transition,
    };
  };

  return (
    <div id="top" className="min-h-screen text-[color:var(--fg)]">
      <Header />

      <main id="main" className="w-full px-6 sm:px-10 lg:px-16">
        {/* HERO */}
        <section
          id="hero"
          ref={heroRef}
          className="relative grid grid-cols-12 gap-x-6 pt-[var(--s6)] pb-[var(--s5)]"
        >
          <RunningLine className="sd-marquee--hero" />
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <motion.h1
              className="text-[clamp(3.25rem,7vw,6rem)] leading-[0.92] font-semibold tracking-tight"
              style={
                reduceMotion
                  ? undefined
                  : {
                      scale: heroScale,
                      y: heroY,
                      opacity: heroOpacity,
                    }
              }
            >
              <WordReveal text="Performance tools for rehearsal and performance." />
            </motion.h1>

            <Reveal delay={0.05}>
              <p className="mt-[var(--s3)] text-[clamp(1.25rem,2.4vw,2rem)] leading-[1.15] text-black/65">
                Artist-run engineering practice building software instruments for ensemble timing and
                tuning.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-[var(--s4)] flex items-center gap-6">
                <button type="button" onClick={scrollToProducts} className="u-link text-sm">
                  Download
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-[var(--s5)] flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-black/45">
                <span aria-hidden="true">—</span>
                <span>SyncTimer · Tenney · Artist-run engineering practice</span>
              </div>
            </Reveal>
          </div>
          <div className="hidden lg:block lg:col-span-2 lg:col-start-10" aria-hidden="true" />
        </section>

        {/* PRODUCTS */}
        <section id="products" className="grid grid-cols-12 gap-x-6 py-[var(--s6)] scroll-mt-24">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <Kicker>Catalog</Kicker>

            <div className="mt-[var(--s4)] space-y-[var(--s6)]">
              {products.map((product) => {
                const isVisible =
                  hoveredProductId === product.id || Boolean(arrivedProductIds[product.id]);

                return (
                  <motion.article
                    key={product.id}
                    id={product.id}
                    className="scroll-mt-24"
                    onMouseEnter={() => setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                    onViewportEnter={() => handleArrive(product.id)}
                    viewport={{ once: true, amount: 0.6 }}
                  >
                    <div className="grid gap-y-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-4 lg:justify-between">
                          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                            <div className="flex items-center gap-3">
                              <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold">
                                {product.name}
                              </h2>
                              <img
                                src={product.wordmarkSrc}
                                alt={product.wordmarkAlt}
                                className="h-5 w-auto sm:h-6"
                                loading="lazy"
                              />
                            </div>
                            <span className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                              {product.catalogId}
                            </span>
                          </div>
                          <a href={product.url} className="u-link text-sm lg:ml-auto">
                            {product.ctaLabel}
                          </a>
                        </div>

                        <p className="mt-[var(--s1)] text-[15px] sm:text-[16px] leading-relaxed text-black/70">
                          {product.sentence}
                        </p>

                        <motion.div
                          {...getMarginaliaMotion(isVisible)}
                          className="mt-[var(--s2)] space-y-1 text-[11px] text-black/45 lg:hidden"
                        >
                          <p className="tracking-[0.18em]">{product.specLine}</p>
                          <div className="flex flex-wrap items-center gap-2 uppercase tracking-[0.28em]">
                            <span>{product.version}</span>
                            <span aria-hidden="true">·</span>
                            <span>{product.platform}</span>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        {...getMarginaliaMotion(isVisible)}
                        className="hidden flex-col items-end gap-2 text-right text-[11px] text-black/45 lg:flex"
                      >
                        <span className="tracking-[0.18em]">{product.specLine}</span>
                        <span className="uppercase tracking-[0.28em]">
                          {product.version} · {product.platform}
                        </span>
                      </motion.div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-2 lg:col-start-10" aria-hidden="true" />
        </section>

        {/* CONTACT */}
        <section id="contact" className="grid grid-cols-12 gap-x-6 py-[var(--s6)] scroll-mt-24">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <div className="flex items-center justify-center text-sm text-black/40">
              <span aria-hidden="true">∎</span>
            </div>

            <div className="mt-[var(--s4)] space-y-[var(--s3)]">
              <p className="text-[15px] sm:text-[16px] leading-relaxed">
                <a href="mailto:developer@stagedevices.com" className="u-link">
                  developer@stagedevices.com
                </a>
              </p>

              <p className="text-xs text-black/50">
                © 2026 Stage Devices · Los Angeles · Built with craft
              </p>

              <p className="text-[11px] text-black/40">
                Accent:{" "}
                <span className="text-[color:var(--accent)]">
                  {accentValue || "#000000"}
                </span>
              </p>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-2 lg:col-start-10" aria-hidden="true" />
        </section>
      </main>
    </div>
  );
}
