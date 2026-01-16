import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

const CONTACT_EMAIL = "developer@stagedevices.com";
const DEFAULT_SUBJECT = "Stage Devices";

type ContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSubject?: string;
  initialMessage?: string;
  initialEmail?: string;
};

function formatBody(name: string, email: string, message: string) {
  const lines = [];
  if (name.trim()) {
    lines.push(`Name: ${name.trim()}`);
  }
  lines.push(`Email: ${email.trim()}`);
  lines.push("Message:");
  lines.push(message.trim());
  return lines.join("\n");
}

function formatCopyText(name: string, email: string, message: string, subject: string) {
  const lines = [`To: ${CONTACT_EMAIL}`, `Subject: ${subject}`];
  if (name.trim()) {
    lines.push(`Name: ${name.trim()}`);
  }
  lines.push(`Email: ${email.trim()}`);
  lines.push("Message:");
  lines.push(message.trim());
  return lines.join("\n");
}

export default function ContactDialog({
  open,
  onOpenChange,
  initialSubject,
  initialMessage,
  initialEmail,
}: ContactDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [website, setWebsite] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!open) {
      setCopyStatus("");
      return;
    }
    setSubject(initialSubject ?? DEFAULT_SUBJECT);
    setMessage(initialMessage ?? "");
    setEmail(initialEmail ?? "");
    setName("");
    setWebsite("");
    const id = window.requestAnimationFrame(() => {
      messageRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [initialEmail, initialMessage, initialSubject, open]);

  const mailtoHref = useMemo(() => {
    const body = formatBody(name, email, message);
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [email, message, name, subject]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (website.trim()) {
      return;
    }
    window.location.href = mailtoHref;
  };

  const handleCopy = async () => {
    if (website.trim()) {
      return;
    }
    const text = formatCopyText(name, email, message, subject);
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopyStatus("COPIED");
        return;
      } catch {
        // Fallback to legacy copy.
      }
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setCopyStatus("COPIED");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sd-dialog__overlay" />
        <Dialog.Content className="sd-dialog__content">
          <div className="flex flex-col gap-6 text-xs uppercase tracking-[0.24em]">
            <div className="flex flex-col gap-2">
              <Dialog.Title className="text-sm font-medium">
                CONTACT / STAGE DEVICES
              </Dialog.Title>
              <p className="text-[10px] tracking-[0.28em]">Reply target: {CONTACT_EMAIL}</p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-[10px]">
                Email *
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                />
              </label>

              <label className="flex flex-col gap-2 text-[10px]">
                Message *
                <textarea
                  ref={messageRef}
                  required
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="border border-black px-3 py-2 text-xs tracking-[0.18em] outline-none"
                />
              </label>

              <label className="flex flex-col gap-2 text-[10px]">
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
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

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="border border-black px-4 py-2 text-[10px] font-medium tracking-[0.3em]"
                >
                  Compose Email
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="border border-black px-4 py-2 text-[10px] tracking-[0.3em]"
                  >
                    Copy
                  </button>
                  {copyStatus ? (
                    <span className="text-[10px] tracking-[0.3em]">{copyStatus}</span>
                  ) : null}
                </div>
              </div>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[10px] underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
