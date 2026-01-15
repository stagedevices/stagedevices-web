import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Nav from "../components/Nav";
import { Kicker, Reveal } from "../components/Reveal";
import TuiRow from "../components/TuiRow";
import { useTui } from "../lib/tuiController";

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
    wordmarkSrc: "/assets/wordmark_synctimer.png",
    wordmarkAlt: "SyncTimer wordmark",
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
    wordmarkSrc: "/assets/wordmark_tenney.png",
    wordmarkAlt: "Tenney wordmark",
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

  const { isTuiEnabled, goToRowById, cameraY } = useTui();

  const scrollToProducts = () => {
    if (isTuiEnabled) {
      goToRowById("products:start");
      if (window.location.hash !== "#products") {
        window.history.replaceState(null, "", "#products");
      }
      return;
    }

    const el = document.getElementById("products");
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div id="top" className="min-h-screen bg-white text-[color:var(--fg)]">
      <Nav />

      <main id="main" className="w-full px-6 sm:px-10 lg:px-16">
        <motion.div style={{ y: cameraY }}>
          {/* HERO */}
          <section
            ref={heroRef}
            className="grid grid-cols-12 gap-x-6 pt-[var(--s6)] pb-[var(--s5)]"
          >
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
                <TuiRow
                  id="hero:display"
                  text="Performance tools for rehearsal and performance."
                  section="hero"
                />
              </motion.h1>

              <Reveal delay={0.05}>
                <p className="mt-[var(--s3)] text-[clamp(1.25rem,2.4vw,2rem)] leading-[1.15] text-black/65">
                  <TuiRow
                    id="hero:deck"
                    text="Artist-run engineering practice building software instruments for ensemble timing and tuning."
                    section="hero"
                  />
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="mt-[var(--s4)] flex items-center gap-6">
                  <button type="button" onClick={scrollToProducts} className="u-link text-sm">
                    <TuiRow id="hero:cta" text="Download" section="hero" />
                  </button>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-[var(--s5)] text-xs uppercase tracking-[0.24em] text-black/45">
                  <TuiRow
                    id="hero:ornament"
                    text="— SyncTimer · Tenney · Artist-run engineering practice"
                    section="hero"
                  />
                </div>
              </Reveal>
            </div>
            <div className="hidden lg:block lg:col-span-2 lg:col-start-10" aria-hidden="true" />
          </section>

          {/* PRINCIPLES */}
          <section className="grid grid-cols-12 gap-x-6 py-[var(--s6)]">
            <div className="col-span-12 lg:col-span-7 lg:col-start-3">
              <Kicker>
                <TuiRow id="principles:kicker" text="Principles" section="principles" />
              </Kicker>
            </div>

            <div className="col-span-12 mt-[var(--s4)] space-y-[var(--s5)]">
              {principles.map((principle, index) => (
                <div key={principle} className="grid grid-cols-12 gap-x-6">
                  <div className="col-span-12 lg:col-span-7 lg:col-start-3">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs tracking-widest text-black/35 lg:hidden">
                        {principleNumerals[index]}
                      </span>
                      <TuiRow
                        id={index === 0 ? "principles:start" : `principles:${index}`}
                        text={principle}
                        section="principles"
                        className="block text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.04] tracking-tight"
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
              <Kicker>
                <TuiRow id="products:start" text="Catalog" section="products" />
              </Kicker>

              <div className="mt-[var(--s4)] space-y-[var(--s6)]">
                {products.map((product) => {
                  const action = { type: "download", url: product.url } as const;
                  return (
                    <article key={product.id} id={product.id} className="scroll-mt-24">
                      <div className="flex flex-wrap items-center gap-3 lg:justify-between">
                        <div className="flex items-center gap-3">
                          <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold">
                            <TuiRow
                              id={`products:${product.id}:start`}
                              text={product.name}
                              section="products"
                              action={action}
                            />
                          </h2>
                          <img
                            src={product.wordmarkSrc}
                            alt={product.wordmarkAlt}
                            className="h-4 w-auto"
                            loading="lazy"
                          />
                        </div>
                        <a href={product.url} className="u-link text-sm lg:ml-auto">
                          Download
                        </a>
                      </div>

                      <p className="mt-[var(--s1)] text-xs tracking-[0.28em] uppercase text-black/45">
                        <TuiRow
                          id={`products:${product.id}:spec`}
                          text={product.spec}
                          section="products"
                          action={action}
                        />
                      </p>

                      <p className="mt-[var(--s2)] italic text-black/60">
                        <TuiRow
                          id={`products:${product.id}:description`}
                          text={product.description}
                          section="products"
                          action={action}
                        />
                      </p>

                      <ul className="mt-[var(--s3)] list-disc pl-5 marker:text-black/25 text-[15px] sm:text-[16px] leading-relaxed space-y-1">
                        {product.bullets.map((bullet, index) => (
                          <li key={bullet}>
                            <TuiRow
                              id={`products:${product.id}:bullet:${index}`}
                              text={bullet}
                              section="products"
                              action={action}
                              className="block"
                            />
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-2 lg:col-start-10" aria-hidden="true" />
          </section>

          {/* WHY */}
          <section className="grid grid-cols-12 gap-x-6 py-[var(--s6)]">
            <div className="col-span-12 lg:col-span-7 lg:col-start-3">
              <Kicker>
                <TuiRow id="why:kicker" text="Why" section="why" />
              </Kicker>

              <ol className="mt-[var(--s4)] space-y-[var(--s4)]">
                {whyRows.map((row, index) => (
                  <li key={row} className="flex gap-6">
                    <span className="text-[clamp(1.25rem,2vw,1.6rem)] font-semibold text-black/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[15px] sm:text-[16px] leading-[1.55]">
                      <TuiRow
                        id={index === 0 ? "why:start" : `why:${index}`}
                        text={row}
                        section="why"
                      />
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="hidden lg:block lg:col-span-2 lg:col-start-10" aria-hidden="true" />
          </section>

          {/* CONTACT */}
          <section id="contact" className="grid grid-cols-12 gap-x-6 py-[var(--s6)] scroll-mt-24">
            <div className="col-span-12 lg:col-span-7 lg:col-start-3">
              <Kicker>Contact</Kicker>

              <div className="mt-[var(--s4)] space-y-[var(--s4)]">
                <p className="text-[15px] sm:text-[16px] leading-relaxed">
                  <a href="mailto:developer@stagedevices.com" className="u-link">
                    <TuiRow
                      id="contact:start"
                      text="developer@stagedevices.com"
                      section="contact"
                      action={{ type: "mailto", url: "mailto:developer@stagedevices.com" }}
                    />
                  </a>
                </p>

                <p className="text-xs text-black/50">
                  <TuiRow
                    id="contact:colophon"
                    text="© 2026 Stage Devices · Los Angeles · Built with craft"
                    section="contact"
                  />
                </p>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-2 lg:col-start-10" aria-hidden="true" />
          </section>
        </motion.div>
      </main>
    </div>
  );
}
