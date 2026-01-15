import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  once?: boolean;
}>;

export function Reveal({ children, className, delay = 0, once = true }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.7 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

type KickerProps = PropsWithChildren<{
  className?: string;
  prefix?: string;
}>;

export function Kicker({ children, className, prefix }: KickerProps) {
  return (
    <div
      className={[
        "flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-black/45",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {prefix ? <span aria-hidden="true">{prefix}</span> : null}
      <span>{children}</span>
    </div>
  );
}

type WordRevealProps = {
  text: string;
  className?: string;
  once?: boolean;
  stagger?: number;
};

export function WordReveal({ text, className, once = true, stagger = 0.02 }: WordRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      role="text"
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.8 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
