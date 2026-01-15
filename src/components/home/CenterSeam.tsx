import { useEffect, useState } from 'react'
import { useReducedMotionSafe } from '../../utils/motion'

const CenterSeam = () => {
  const prefersReducedMotion = useReducedMotionSafe()
  const [scanActive, setScanActive] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined
    }

    let scanTimeout: number
    let idleTimeout: number

    const scheduleScan = () => {
      idleTimeout = window.setTimeout(
        () => {
          setScanActive(true)
          scanTimeout = window.setTimeout(() => {
            setScanActive(false)
          }, 1200)
          scheduleScan()
        },
        12000 + Math.random() * 8000,
      )
    }

    scheduleScan()

    return () => {
      window.clearTimeout(idleTimeout)
      window.clearTimeout(scanTimeout)
    }
  }, [prefersReducedMotion])

  return (
    <div className="center-seam" aria-hidden="true">
      <span className={`center-seam__scan ${scanActive ? 'is-active' : ''}`} />
    </div>
  )
}

export default CenterSeam
