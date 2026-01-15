import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotionSafe } from '../../utils/motion'

type PanelMicroAnnotationsProps = {
  labels: Array<{ label: string; top: string; left: string }>
}

const PanelMicroAnnotations = ({ labels }: PanelMicroAnnotationsProps) => {
  const prefersReducedMotion = useReducedMotionSafe()

  const drifts = useMemo(
    () =>
      labels.map((_, index) => ({
        x: index % 2 === 0 ? 1.6 : -1.4,
        y: index % 2 === 0 ? -1.2 : 1.4,
        duration: 10 + index * 2,
        delay: index * 0.4,
      })),
    [labels],
  )

  return (
    <div className="panel-annotations" aria-hidden="true">
      {labels.map((item, index) => (
        <motion.span
          key={item.label}
          className="panel-annotation"
          style={{ top: item.top, left: item.left }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, drifts[index].x, 0],
                  y: [0, drifts[index].y, 0],
                }
          }
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: drifts[index].duration,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: drifts[index].delay,
                }
          }
        >
          {item.label}
        </motion.span>
      ))}
    </div>
  )
}

export default PanelMicroAnnotations
