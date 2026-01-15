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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.7 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

type RevealLineProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export function RevealLine({ children, className, delay = 0 }: RevealLineProps) {
  return (
    <Reveal className={className} delay={delay}>
      {children}
    </Reveal>
  );
}
