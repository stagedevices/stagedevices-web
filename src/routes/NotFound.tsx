import { Link } from "react-router-dom";
import Header from "../components/Header";
import RunningLine from "../components/RunningLine";
import { Kicker } from "../components/Reveal";

export default function NotFound() {
  return (
    <div id="top" className="min-h-screen text-[color:var(--fg)]">
      <Header />

      <div className="pt-[var(--header-h)]">
        <RunningLine className="sd-marquee--belowHeader" />

        <main id="main" className="w-full px-6 sm:px-10 lg:px-16">
          <section className="grid grid-cols-12 gap-x-6 pt-[var(--s6)] pb-[var(--s6)]">
            <div className="col-span-12 lg:col-span-7 lg:col-start-3">
              <Kicker>404</Kicker>
              <h1 className="mt-[var(--s2)] text-[clamp(2.6rem,6vw,4.2rem)] font-semibold leading-[0.95]">
                Not found
              </h1>
              <div className="mt-[var(--s3)] text-sm text-black/70">
                <Link to="/" className="u-link">
                  Back to home
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
