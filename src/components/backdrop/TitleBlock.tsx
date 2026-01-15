import { motion } from 'framer-motion'
import { useReducedMotionSafe } from '../../utils/motion'

const TitleBlock = () => {
  const prefersReducedMotion = useReducedMotionSafe()

  return (
    <div className="title-block" aria-hidden="true">
      <strong>PROJECT: STAGE DEVICES</strong>
      <div className="row">
        <span>SHEET: SD-001</span>
        <span>REV: A</span>
      </div>
      <div className="row">
        <span>DATE: 2026-01-14</span>
        <span>SCALE: 1:1</span>
      </div>
      <motion.div
        className="mt-2 inline-block rounded border border-[var(--cardBorder)] px-2 py-1 text-[9px] tracking-[0.24em]"
        initial={prefersReducedMotion ? { opacity: 1 } : { rotate: -2, opacity: 0, scale: 0.9 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { rotate: [0, -2, 2, -1, 0], opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        REVISION STAMP
      </motion.div>
    </div>
  )
}

export default TitleBlock
