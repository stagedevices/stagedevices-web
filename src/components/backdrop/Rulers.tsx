import { useEffect, useMemo, useRef, useState } from 'react'

const MAX_LABELS = 25

const Rulers = () => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const pointer = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    const updateOffset = () => {
      const scrollFactor = Math.min(window.scrollY / 240, 1) * 4
      const pointerX = (pointer.current.x - 0.5) * 4
      const pointerY = (pointer.current.y - 0.5) * 4
      setOffset({ x: pointerX, y: scrollFactor + pointerY })
    }

    const handlePointer = (event: PointerEvent) => {
      pointer.current = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      }
      updateOffset()
    }

    const handleScroll = () => {
      updateOffset()
    }

    updateSize()
    updateOffset()

    window.addEventListener('resize', updateSize)
    window.addEventListener('pointermove', handlePointer)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const topLabels = useMemo(() => {
    if (!size.width) return []
    const labels = []
    const step = 120
    for (let x = step; x < size.width && labels.length < MAX_LABELS; x += step) {
      labels.push({ value: x, position: x })
    }
    return labels
  }, [size.width])

  const leftLabels = useMemo(() => {
    if (!size.height) return []
    const labels = []
    const step = 120
    for (let y = step; y < size.height && labels.length < MAX_LABELS; y += step) {
      labels.push({ value: y, position: y })
    }
    return labels
  }, [size.height])

  return (
    <>
      <div
        className="ruler top"
        style={{ transform: `translate3d(${offset.x}px, 0, 0)` }}
        aria-hidden="true"
      >
        {topLabels.map((label) => (
          <span
            key={label.value}
            className="ruler-label"
            style={{ left: label.position, top: 16 }}
          >
            {label.value}
          </span>
        ))}
      </div>
      <div
        className="ruler left"
        style={{ transform: `translate3d(0, ${offset.y}px, 0)` }}
        aria-hidden="true"
      >
        {leftLabels.map((label) => (
          <span
            key={label.value}
            className="ruler-label"
            style={{ top: label.position, left: 12 }}
          >
            {label.value}
          </span>
        ))}
      </div>
    </>
  )
}

export default Rulers
