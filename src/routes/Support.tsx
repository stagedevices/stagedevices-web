import { useMemo, useState, type ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import Header from "../components/Header";
import RunningLine from "../components/RunningLine";
import ContactDialog from "../components/ContactDialog";
import { Kicker } from "../components/Reveal";
import { PRIVACY_URL, SYNC_TIMER_VERSION, TENNEY_VERSION } from "../lib/siteMeta";

type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
  searchText: string;
};

const syncTimerFaq: FaqItem[] = [
  {
    id: "st-setup",
    question: "How do I set up a rehearsal timer?",
    answer: (
      <p>
        Start a new cue sheet, add cues with durations, then choose your sync mode in Settings
        before you begin.
      </p>
    ),
    searchText: "set up rehearsal timer cue sheet durations sync mode settings",
  },
  {
    id: "st-share",
    question: "Can I share a cue sheet with the ensemble?",
    answer: (
      <p>
        Export the cue sheet from the menu and share the file through AirDrop, email, or your
        preferred file service.
      </p>
    ),
    searchText: "share cue sheet export airdrop email file",
  },
];

const tenneyFaq: FaqItem[] = [
  {
    id: "tn-layout",
    question: "How do I reset the lattice layout?",
    answer: (
      <p>
        Open the layout menu, choose Reset, and confirm to return to the default lattice
        orientation.
      </p>
    ),
    searchText: "reset lattice layout menu default orientation",
  },
  {
    id: "tn-export",
    question: "How do I export a tuning or scale?",
    answer: (
      <p>
        Use the Export command in the file menu to generate a shareable scale file or text
        reference.
      </p>
    ),
    searchText: "export tuning scale file menu shareable",
  },
];

const syncTimerKnownIssues: Array<{ title: string; detail: string }> = [
  // TODO: Add SyncTimer known issues.
];

const tenneyKnownIssues: Array<{ title: string; detail: string }> = [
  // TODO: Add Tenney known issues.
];

function filterFaq(items: FaqItem[], query: string) {
  if (!query) return items;
  return items.filter((item) => item.searchText.toLowerCase().includes(query));
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (!items.length) {
    return <p className="text-sm text-black/60">No matching FAQ entries.</p>;
  }

  return (
    <Accordion.Root type="multiple" className="mt-4 space-y-3">
      {items.map((item) => (
        <Accordion.Item key={item.id} value={item.id} className="border-b border-black/10 pb-3">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-baseline justify-between text-left text-sm font-medium text-black hover:underline hover:underline-offset-4">
              {item.question}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="mt-2 text-sm text-black/70">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactPreset, setContactPreset] = useState<{
    subject?: string;
    message?: string;
    email?: string;
  }>({});

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSyncFaq = useMemo(
    () => filterFaq(syncTimerFaq, normalizedQuery),
    [normalizedQuery],
  );
  const filteredTenneyFaq = useMemo(
    () => filterFaq(tenneyFaq, normalizedQuery),
    [normalizedQuery],
  );

  const bugReportMessage = `App (choose): SyncTimer or Tenney\nVersion: SyncTimer ${SYNC_TIMER_VERSION}; Tenney ${TENNEY_VERSION}\nDevice/OS:\nSteps:\nExpected:\nActual:\n`;

  const openEmailSupport = () => {
    setContactPreset({});
    setIsContactOpen(true);
  };

  const openBugReport = () => {
    setContactPreset({
      subject: "Stage Devices — Bug report",
      message: bugReportMessage,
    });
    setIsContactOpen(true);
  };

  return (
    <div id="top" className="min-h-screen text-[color:var(--fg)]">
      <Header />

      <div className="pt-[var(--header-h)]">
        <RunningLine className="sd-marquee--belowHeader" />

        <main id="main" className="w-full px-6 sm:px-10 lg:px-16">
          <section className="grid grid-cols-12 gap-x-6 pt-[var(--s6)] pb-[var(--s5)]">
            <div className="col-span-12 lg:col-span-7 lg:col-start-3">
              <Kicker>Support</Kicker>
              <h1 className="mt-[var(--s2)] text-[clamp(2.6rem,6vw,4.2rem)] font-semibold leading-[0.95]">
                Support
              </h1>

              <div className="mt-[var(--s3)] flex flex-wrap items-center gap-5 text-sm text-black/70">
                <a href="#quick-start" className="u-link">
                  Quick start
                </a>
                <a
                  href="#contact"
                  className="u-link"
                  onClick={(event) => {
                    event.preventDefault();
                    openEmailSupport();
                  }}
                >
                  Email support
                </a>
                <a
                  href="#contact"
                  className="u-link"
                  onClick={(event) => {
                    event.preventDefault();
                    openBugReport();
                  }}
                >
                  Report a bug
                </a>
              </div>

              <div className="mt-[var(--s5)]">
                <Kicker>Find</Kicker>
                <input
                  type="search"
                  placeholder="Search support…"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="mt-3 w-full border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                />
              </div>
            </div>
          </section>

          <section
            id="quick-start"
            className="grid grid-cols-12 gap-x-6 py-[var(--s5)] scroll-mt-24"
          >
            <div className="col-span-12 lg:col-span-7 lg:col-start-3 space-y-4">
              <Kicker>Quick start</Kicker>
              <p className="text-[15px] sm:text-[16px] leading-relaxed text-black/70">
                Get moving fast with a new cue sheet or lattice, then return here for detailed help or
                to report issues.
              </p>
              <ul className="list-disc pl-5 text-sm text-black/70">
                <li>Update to the latest build before troubleshooting.</li>
                <li>Use the support links below for app-specific help resources.</li>
                <li>
                  Review the privacy policy before sending diagnostics: {" "}
                  <a
                    className="u-link"
                    href={PRIVACY_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Privacy policy
                  </a>
                  .
                </li>
              </ul>
            </div>
          </section>

          <section id="synctimer" className="grid grid-cols-12 gap-x-6 py-[var(--s5)] scroll-mt-24">
            <div className="col-span-12 lg:col-span-7 lg:col-start-3 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold">SyncTimer</h2>
                  <a
                    href="https://synctimerapp.com/support"
                    className="u-link text-xs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    synctimerapp.com/support
                  </a>
                </div>
                <p className="text-sm uppercase tracking-[0.28em] text-black/45">
                  Version {SYNC_TIMER_VERSION}
                </p>
              </div>

              <div>
                <Kicker>FAQ</Kicker>
                <FaqAccordion items={filteredSyncFaq} />
              </div>

              <div className="space-y-2">
                <Kicker>Report with Sentry</Kicker>
                <ul className="list-disc pl-5 text-sm text-black/70">
                  <li>Open Settings.</li>
                  <li>Support / Diagnostics.</li>
                  <li>Report a problem.</li>
                  <li>Include steps + screenshots.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Kicker>Known issues</Kicker>
                {syncTimerKnownIssues.length ? (
                  <ul className="list-disc pl-5 text-sm text-black/70">
                    {syncTimerKnownIssues.map((issue) => (
                      <li key={issue.title}>
                        <span className="font-medium">{issue.title}</span> — {issue.detail}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-black/60">No known issues listed yet.</p>
                )}
              </div>
            </div>
          </section>

          <section id="tenney" className="grid grid-cols-12 gap-x-6 py-[var(--s5)] scroll-mt-24">
            <div className="col-span-12 lg:col-span-7 lg:col-start-3 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold">Tenney</h2>
                  <a
                    href="https://tenneyapp.com/support"
                    className="u-link text-xs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    tenneyapp.com/support
                  </a>
                </div>
                <p className="text-sm uppercase tracking-[0.28em] text-black/45">
                  Version {TENNEY_VERSION}
                </p>
              </div>

              <div>
                <Kicker>FAQ</Kicker>
                <FaqAccordion items={filteredTenneyFaq} />
              </div>

              <div className="space-y-2">
                <Kicker>Report with Sentry</Kicker>
                <ul className="list-disc pl-5 text-sm text-black/70">
                  <li>Open Settings.</li>
                  <li>Support / Diagnostics.</li>
                  <li>Report a problem.</li>
                  <li>Include steps + screenshots.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Kicker>Known issues</Kicker>
                {tenneyKnownIssues.length ? (
                  <ul className="list-disc pl-5 text-sm text-black/70">
                    {tenneyKnownIssues.map((issue) => (
                      <li key={issue.title}>
                        <span className="font-medium">{issue.title}</span> — {issue.detail}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-black/60">No known issues listed yet.</p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      <ContactDialog
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
        initialSubject={contactPreset.subject}
        initialMessage={contactPreset.message}
        initialEmail={contactPreset.email}
      />
    </div>
  );
}
