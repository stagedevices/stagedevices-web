import Nav from "../components/Nav";
import { Reveal, RevealLine } from "../components/Reveal";
import synctimerIcon from "../assets/synctimer.svg";
import tenneyIcon from "../assets/tenney.svg";
import { useReducedMotion } from "framer-motion";

const SYNC_TIMER_URL = "https://synctimerapp.com";
const TENNEY_URL = "https://tenneyapp.com";

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4 py-6">
      <div className="h-px flex-1 border-t border-black/10" />
      <span className="text-xs uppercase tracking-[0.28em] text-black/60">{children}</span>
      <div className="h-px flex-1 border-t border-black/10" />
    </div>
  );
}

function TextLink({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const cls =
    "inline-flex items-center gap-2 text-sm underline underline-offset-4 decoration-black/30 decoration-[0.5px] hover:decoration-black/60";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {children}
      </button>
    );
  }

  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}

export default function Home() {
  const reduceMotion = useReducedMotion();

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div id="top" className="min-h-screen bg-white text-[color:var(--fg)]">
      <Nav />

      <main id="main" className="mx-auto max-w-[72ch] px-6">
        {/* HERO */}
        <section className="pt-16 sm:pt-24 pb-12">
          <Reveal>
            <h1 className="text-6xl sm:text-8xl leading-[0.95] font-semibold tracking-tight">
              Performance tools, built with craft.
            </h1>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-black/60">
              Artist-run engineering practice building software instruments for rehearsal and performance.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-8">
              <TextLink onClick={scrollToProducts}>Download</TextLink>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-10 text-xs uppercase tracking-[0.24em] text-black/60">
              <span className="inline-flex items-center gap-2">
                <img src={synctimerIcon} alt="" className="h-4 w-4" aria-hidden="true" />
                SyncTimer
              </span>
              <span className="mx-3 text-black/30">·</span>
              <span className="inline-flex items-center gap-2">
                <img src={tenneyIcon} alt="" className="h-4 w-4" aria-hidden="true" />
                Tenney
              </span>
            </p>
          </Reveal>
        </section>

        {/* PRINCIPLES */}
        <section className="border-t border-black/10">
          <SectionLabel>Principles</SectionLabel>

          <div className="pb-12 space-y-10">
            <RevealLine delay={0.02}>
              <div className="flex items-baseline gap-4">
                <span className="text-xs tracking-widest text-black/40">I.</span>
                <p className="text-3xl sm:text-5xl leading-[1.08] tracking-tight">
                  Built for real rooms and real people.
                </p>
              </div>
            </RevealLine>

            <RevealLine delay={0.06}>
              <div className="flex items-baseline gap-4">
                <span className="text-xs tracking-widest text-black/40">II.</span>
                <p className="text-3xl sm:text-5xl leading-[1.08] tracking-tight">
                  Precision without ceremony.
                </p>
              </div>
            </RevealLine>

            <RevealLine delay={0.10}>
              <div className="flex items-baseline gap-4">
                <span className="text-xs tracking-widest text-black/40">III.</span>
                <p className="text-3xl sm:text-5xl leading-[1.08] tracking-tight">
                  Craft over noise.
                </p>
              </div>
            </RevealLine>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="border-t border-black/10 scroll-mt-24">
          <SectionLabel>Download</SectionLabel>

          {/* SyncTimer entry */}
          <article id="synctimer" className="py-12 border-t border-black/10 scroll-mt-24">
            <Reveal>
              <header className="flex items-end justify-between gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">SyncTimer</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-black/60 italic">
                    A first-class timer for timer pieces and ensembles.
                  </p>
                </div>
                <a
                  href={SYNC_TIMER_URL}
                  className="text-sm underline underline-offset-4 decoration-black/30 decoration-[0.5px] hover:decoration-black/60"
                >
                  Download
                </a>
              </header>
            </Reveal>

            <Reveal delay={0.06}>
              <ul className="mt-6 list-disc pl-5 text-[15px] leading-relaxed marker:text-black/30 space-y-2">
                <li>
                  <span className="font-medium">Countdown + synced timers</span> for groups
                </li>
                <li>
                  <span className="font-medium">Join fast</span> via QR / rooms
                </li>
                <li>
                  <span className="font-medium">Cue sheets</span> for performance structure
                </li>
              </ul>
            </Reveal>
          </article>

          {/* Tenney entry */}
          <article id="tenney" className="py-12 border-t border-black/10 scroll-mt-24">
            <Reveal>
              <header className="flex items-end justify-between gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Tenney</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-black/60 italic">
                    A lattice-first tuning environment for working musicians.
                  </p>
                </div>
                <a
                  href={TENNEY_URL}
                  className="text-sm underline underline-offset-4 decoration-black/30 decoration-[0.5px] hover:decoration-black/60"
                >
                  Download
                </a>
              </header>
            </Reveal>

            <Reveal delay={0.06}>
              <ul className="mt-6 list-disc pl-5 text-[15px] leading-relaxed marker:text-black/30 space-y-2">
                <li>
                  <span className="font-medium">Lattice</span> navigation as the core interface
                </li>
                <li>
                  <span className="font-medium">Tuner</span> designed for practice + rehearsal
                </li>
                <li>
                  <span className="font-medium">Save / export</span> for reuse and sharing
                </li>
              </ul>
            </Reveal>
          </article>
        </section>

        {/* WHY */}
        <section className="border-t border-black/10">
          <SectionLabel>Why</SectionLabel>

          <div className="pb-12 border-t border-black/10">
            <ol className="py-12 space-y-6">
              <RevealLine>
                <li className="flex gap-6">
                  <span className="text-xs uppercase tracking-[0.24em] text-black/40 w-16 shrink-0">
                    01
                  </span>
                  <p className="text-[15px] leading-relaxed">
                    Because ensembles deserve time tools that don’t break under pressure.
                  </p>
                </li>
              </RevealLine>

              <RevealLine delay={0.04}>
                <li className="flex gap-6">
                  <span className="text-xs uppercase tracking-[0.24em] text-black/40 w-16 shrink-0">
                    02
                  </span>
                  <p className="text-[15px] leading-relaxed">
                    Because craft matters more than features.
                  </p>
                </li>
              </RevealLine>

              <RevealLine delay={0.08}>
                <li className="flex gap-6">
                  <span className="text-xs uppercase tracking-[0.24em] text-black/40 w-16 shrink-0">
                    03
                  </span>
                  <p className="text-[15px] leading-relaxed">
                    Because the best performance software disappears when you need it most.
                  </p>
                </li>
              </RevealLine>
            </ol>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="border-t border-black/10 scroll-mt-24">
          <SectionLabel>Contact</SectionLabel>

          <div className="py-12 border-t border-black/10">
            <Reveal>
              <p className="text-[15px] leading-relaxed">
                <a
                  href="mailto:developer@stagedevices.com"
                  className="underline underline-offset-4 decoration-black/30 decoration-[0.5px] hover:decoration-black/60"
                >
                  developer@stagedevices.com
                </a>
              </p>
            </Reveal>

            <p className="mt-16 text-xs text-black/50">
              © {new Date().getFullYear()} Stage Devices
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
