import { motion } from 'framer-motion'
import { useReducedMotionSafe } from '../../utils/motion'

type HeroScanlineProps = {
  active: boolean
}

const HeroScanline = ({ active }: HeroScanlineProps) => {
  const prefersReducedMotion = useReducedMotionSafe()

  if (!active || prefersReducedMotion) {
    return null
  }

  return (
    <motion.div
      className="scanline"
      aria-hidden="true"
      initial={{ y: '-10%', opacity: 0 }}
      animate={{ y: ['-10%', '110%'], opacity: [0, 0.9, 0] }}
      transition={{ duration: 1.7, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.8 }}
    />
  )
}

export default HeroScanline
