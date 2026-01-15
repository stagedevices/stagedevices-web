import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Nav from "../components/Nav";
import { Kicker, Reveal, WordReveal } from "../components/Reveal";

const SYNC_TIMER_URL = "https://synctimerapp.com";
const TENNEY_URL = "https://tenneyapp.com";

const principles = [
  "Built for real rooms and real people.",
  "Precision without ceremony.",
  "Craft over noise.",
];

const principleNumerals = ["I.", "II.", "III."];

const products = [
  {
    id: "synctimer",
    name: "SyncTimer",
    spec: "iOS / iPadOS · Ensemble timer",
    description: "A first-class timer for timer pieces and ensembles.",
    bullets: [
      "Countdown + synced timers for groups",
      "Join fast via QR / rooms",
      "Cue sheets for performance structure",
    ],
    url: SYNC_TIMER_URL,
  },
  {
    id: "tenney",
    name: "Tenney",
    spec: "iOS / iPadOS · Tuning environment",
    description: "A lattice-first tuning environment for working musicians.",
    bullets: [
      "Lattice navigation as the core interface",
      "Tuner designed for practice + rehearsal",
      "Save / export for reuse and sharing",
    ],
    url: TENNEY_URL,
  },
];

const whyRows = [
  "Because ensembles deserve time tools that don’t break under pressure.",
  "Because craft matters more than features.",
  "Because the best performance software disappears when you need it most.",
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

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div id="top" className="min-h-screen bg-white text-[color:var(--fg)]">
      <Nav />

      <main id="main" className="w-full px-6 sm:px-10 lg:px-16">
        {/* HERO */}
        <section ref={heroRef} className="grid grid-cols-12 gap-x-6 pt-[var(--s6)] pb-[var(--s5)]">
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
        </section>

        {/* PRINCIPLES */}
        <section className="grid grid-cols-12 gap-x-6 py-[var(--s6)]">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <Kicker>Principles</Kicker>
          </div>

          <div className="col-span-12 mt-[var(--s4)] space-y-[var(--s5)]">
            {principles.map((principle, index) => (
              <div key={principle} className="grid grid-cols-12 gap-x-6">
                <div className="col-span-12 lg:col-span-7 lg:col-start-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs tracking-widest text-black/35 lg:hidden">
                      {principleNumerals[index]}
                    </span>
                    <WordReveal
                      text={principle}
                      className="block text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.04] tracking-tight"
                      stagger={0.018}
                    />
                  </div>
                </div>
                <div className="hidden lg:block lg:col-span-2 lg:col-start-10">
                  <span className="text-xs tracking-widest text-black/35">
                    {principleNumerals[index]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="grid grid-cols-12 gap-x-6 py-[var(--s6)] scroll-mt-24">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <Kicker>Catalog</Kicker>

            <div className="mt-[var(--s4)] space-y-[var(--s6)]">
              {products.map((product) => (
                <article key={product.id} id={product.id} className="scroll-mt-24">
                  <div className="flex flex-wrap items-baseline gap-3 lg:justify-between">
                    <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold">
                      {product.name}
                    </h2>
                    <a href={product.url} className="u-link text-sm lg:ml-auto">
                      Download
                    </a>
                  </div>

                  <p className="mt-[var(--s1)] text-xs tracking-[0.28em] uppercase text-black/45">
                    {product.spec}
                  </p>

                  <p className="mt-[var(--s2)] italic text-black/60">{product.description}</p>

                  <ul className="mt-[var(--s3)] list-disc pl-5 marker:text-black/25 text-[15px] sm:text-[16px] leading-relaxed space-y-1">
                    {product.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="grid grid-cols-12 gap-x-6 py-[var(--s6)]">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <Kicker>Why</Kicker>

            <ol className="mt-[var(--s4)] space-y-[var(--s4)]">
              {whyRows.map((row, index) => (
                <li key={row} className="flex gap-6">
                  <span className="text-[clamp(1.25rem,2vw,1.6rem)] font-semibold text-black/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] sm:text-[16px] leading-[1.55]">{row}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="grid grid-cols-12 gap-x-6 py-[var(--s6)] scroll-mt-24">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <Kicker>Contact</Kicker>

            <div className="mt-[var(--s4)] space-y-[var(--s4)]">
              <p className="text-[15px] sm:text-[16px] leading-relaxed">
                <a href="mailto:developer@stagedevices.com" className="u-link">
                  developer@stagedevices.com
                </a>
              </p>

              <p className="text-xs text-black/50">© 2026 Stage Devices · Los Angeles · Built with craft</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
