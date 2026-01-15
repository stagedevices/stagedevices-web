import { useMemo, useState, type CSSProperties, type PointerEvent } from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import BlueprintTile from './BlueprintTile'
import PanelSpotlight from './PanelSpotlight'
import PanelMicroAnnotations from './PanelMicroAnnotations'
import { useReducedMotionSafe } from '../../utils/motion'
import AppIcon from '../ui/AppIcon'

export type PanelProduct = {
  id: string
  name: string
  icon: string
  label: string
  bullets: string[]
  capabilities: string[]
  annotations: Array<{ label: string; top: string; left: string }>
}

type SplitPanelProps = {
  product: PanelProduct
  onView: () => void
}

const SplitPanel = ({ product, onView }: SplitPanelProps) => {
  const prefersReducedMotion = useReducedMotionSafe()
  const [hovered, setHovered] = useState(false)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x, y })
  }

  const handlePointerLeave = () => {
    setHovered(false)
    setSpotlight({ x: 50, y: 50 })
  }

  const parallax = useMemo(() => {
    if (prefersReducedMotion || !hovered) {
      return { x: 0, y: 0 }
    }

    return {
      x: ((spotlight.x - 50) / 50) * 3,
      y: ((spotlight.y - 50) / 50) * 3,
    }
  }, [hovered, prefersReducedMotion, spotlight.x, spotlight.y])

  const spotlightStyle = {
    '--spotlight-x': `${spotlight.x}%`,
    '--spotlight-y': `${spotlight.y}%`,
  } as CSSProperties

  return (
    <div
      className={`split-panel ${hovered ? 'is-hovered' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handlePointerLeave}
    >
      <div className="split-panel__grid" aria-hidden="true" />
      <PanelSpotlight active={hovered} style={spotlightStyle} />
      <BlueprintTile
        className="split-panel__tile"
        style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}
      />
      <PanelMicroAnnotations labels={product.annotations} />
      <motion.div
        className="panel-glass"
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="panel-header">
          <AppIcon
            src={product.icon}
            alt={`${product.name} icon`}
            className="home-app-icon"
          />
          <div>
            <p className="panel-title">{product.name}</p>
            <p className="panel-label">{product.label}</p>
          </div>
        </div>
        <ul className="panel-bullets">
          {product.bullets.map((bullet) => (
            <li key={bullet}>
              <span className="panel-bullet-dot" aria-hidden="true" />
              {bullet}
            </li>
          ))}
        </ul>
        <Button type="button" className="home-cta" onClick={onView}>
          View
        </Button>
      </motion.div>
    </div>
  )
}

export default SplitPanel
