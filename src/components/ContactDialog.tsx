import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { SYNC_TIMER_VERSION, TENNEY_VERSION } from "../lib/siteMeta";

const CONTACT_EMAIL = "developer@stagedevices.com";
const DEFAULT_SUBJECT = "Stage Devices";
const DEFAULT_REGARDING = "Not sure";
const DEFAULT_REASON = "Support";
const FORM_ENDPOINT = "https://formspree.io/f/mdaakqag";

const REGARDING_OPTIONS = ["SyncTimer", "Tenney", "Stage Devices", "Not sure"] as const;
const REASON_OPTIONS = [
  "Support",
  "Bug report",
  "Feature request",
  "Partnership",
  "Press",
  "Other",
] as const;

type RegardingOption = (typeof REGARDING_OPTIONS)[number];
type ReasonOption = (typeof REASON_OPTIONS)[number];

type ContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSubject?: string;
  initialMessage?: string;
  initialEmail?: string;
  initialRegarding?: RegardingOption;
  initialReason?: ReasonOption;
  initialDeviceOs?: string;
};

function getVersionString(regarding: RegardingOption) {
  if (regarding === "SyncTimer") {
    return `SyncTimer ${SYNC_TIMER_VERSION}`;
  }
  if (regarding === "Tenney") {
    return `Tenney ${TENNEY_VERSION}`;
  }
  if (regarding === "Not sure") {
    return `SyncTimer ${SYNC_TIMER_VERSION} · Tenney ${TENNEY_VERSION}`;
  }
  return "N/A";
}

export default function ContactDialog({
  open,
  onOpenChange,
  initialSubject,
  initialMessage,
  initialEmail,
  initialRegarding,
  initialReason,
  initialDeviceOs,
}: ContactDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [regarding, setRegarding] = useState<RegardingOption>(DEFAULT_REGARDING);
  const [reason, setReason] = useState<ReasonOption>(DEFAULT_REASON);
  const [deviceOs, setDeviceOs] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setSubject(initialSubject ?? DEFAULT_SUBJECT);
    setMessage(initialMessage ?? "");
    setEmail(initialEmail ?? "");
    setRegarding(initialRegarding ?? DEFAULT_REGARDING);
    setReason(initialReason ?? DEFAULT_REASON);
    setName("");
    setDeviceOs(initialDeviceOs ?? "");
    setWebsite("");
    setStatus("idle");
    setErrorText("");
    const id = window.requestAnimationFrame(() => {
      messageRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [
    initialDeviceOs,
    initialEmail,
    initialMessage,
    initialReason,
    initialRegarding,
    initialSubject,
    open,
  ]);

  const versionString = useMemo(() => getVersionString(regarding), [regarding]);
  const isSending = status === "sending";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail || !trimmedMessage || !regarding || !reason) {
      setErrorText("Please complete the required fields.");
      setStatus("error");
      return;
    }

    if (website.trim()) {
      setStatus("sent");
      setErrorText("");
      return;
    }

    setStatus("sending");
    setErrorText("");

    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("email", trimmedEmail);
    formData.set("message", trimmedMessage);
    formData.set("regarding", regarding);
    formData.set("reason", reason);
    formData.set("deviceOs", deviceOs.trim());
    formData.set("version", versionString);
    formData.set("subject", subject.trim());

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        setStatus("error");
        setErrorText("Unable to send. Please try again.");
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorText("Unable to send. Please try again.");
    }
  };

  const handleSendAnother = () => {
    setSubject(initialSubject ?? DEFAULT_SUBJECT);
    setMessage(initialMessage ?? "");
    setEmail(initialEmail ?? "");
    setRegarding(initialRegarding ?? DEFAULT_REGARDING);
    setReason(initialReason ?? DEFAULT_REASON);
    setName("");
    setDeviceOs(initialDeviceOs ?? "");
    setWebsite("");
    setStatus("idle");
    setErrorText("");
    window.requestAnimationFrame(() => {
      messageRef.current?.focus();
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sd-dialog__overlay" />
        <Dialog.Content className="sd-dialog__content">
          <div className="flex flex-col gap-6 text-xs uppercase tracking-[0.24em]">
            <div className="flex flex-col gap-2">
              <p className="text-[9px] tracking-[0.32em]">SDEV-FORM / 001</p>
              <Dialog.Title className="text-sm font-medium">
                CONTACT / STAGE DEVICES
              </Dialog.Title>
              <p className="text-[10px] tracking-[0.28em]">
                Reply target: {CONTACT_EMAIL}
              </p>
            </div>

            {status === "sent" ? (
              <div className="flex flex-col gap-6 text-[10px] tracking-[0.24em]">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium tracking-[0.2em]">Thank you.</p>
                  <p className="text-[10px] tracking-[0.24em]">
                    Ticket created · {reason} · {regarding} · {versionString}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="border border-black px-4 py-2 text-[10px] font-medium tracking-[0.3em]"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSendAnother}
                    className="border border-black px-4 py-2 text-[10px] tracking-[0.3em]"
                  >
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-[10px]">
                    Name
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={isSending}
                      className="border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-[10px]">
                    Email *
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isSending}
                      className="border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-[10px]">
                  Message *
                  <textarea
                    ref={messageRef}
                    required
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    disabled={isSending}
                    className="border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-[10px]">
                    Regarding *
                    <select
                      required
                      value={regarding}
                      onChange={(event) =>
                        setRegarding(event.target.value as RegardingOption)
                      }
                      disabled={isSending}
                      className="border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                    >
                      {REGARDING_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-[10px]">
                    Reason *
                    <select
                      required
                      value={reason}
                      onChange={(event) => setReason(event.target.value as ReasonOption)}
                      disabled={isSending}
                      className="border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                    >
                      {REASON_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-[10px]">
                  Device / OS
                  <input
                    type="text"
                    value={deviceOs}
                    onChange={(event) => setDeviceOs(event.target.value)}
                    disabled={isSending}
                    placeholder="iPhone 15 Pro · iOS 17.3"
                    className="border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                  />
                </label>

                <label className="flex flex-col gap-2 text-[10px]">
                  Version
                  <input
                    type="text"
                    value={versionString}
                    readOnly
                    tabIndex={-1}
                    className="border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                  />
                </label>

                <label className="sr-only" htmlFor="contact-website">
                  Website
                </label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  autoComplete="off"
                  tabIndex={-1}
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  className="sr-only"
                />

                {status === "error" ? (
                  <p className="text-[10px] tracking-[0.24em]">{errorText}</p>
                ) : null}

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="border border-black px-4 py-2 text-[10px] font-medium tracking-[0.3em]"
                  >
                    {isSending ? "Sending" : "Send"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    disabled={isSending}
                    className="text-[10px] tracking-[0.3em] underline underline-offset-4"
                  >
                    Close
                  </button>
                </div>
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
