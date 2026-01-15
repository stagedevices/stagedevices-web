import { motion } from 'framer-motion'
import { useReducedMotionSafe } from '../../utils/motion'

type DraftingTraceProps = {
  active: boolean
  seed: number
}

const DraftingTrace = ({ active, seed }: DraftingTraceProps) => {
  const prefersReducedMotion = useReducedMotionSafe()

  if (!active || prefersReducedMotion) {
    return null
  }

  return (
    <motion.svg
      key={seed}
      className="pointer-events-none absolute bottom-8 left-8 h-20 w-28 opacity-70"
      viewBox="0 0 120 80"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M10 60 L40 40 L70 52 L100 24"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 0.8] }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
      <motion.path
        d="M18 22 L32 22 L32 10"
        stroke="var(--ink)"
        strokeWidth="0.8"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.8, 0.6] }}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
      />
    </motion.svg>
  )
}

export default DraftingTrace
