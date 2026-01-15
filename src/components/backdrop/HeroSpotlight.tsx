import { useMemo, type CSSProperties } from 'react'

type HeroSpotlightProps = {
  x: number
  y: number
  active: boolean
}

const HeroSpotlight = ({ x, y, active }: HeroSpotlightProps) => {
  const style = useMemo(
    () =>
      ({
        '--spotlight-x': `${x}%`,
        '--spotlight-y': `${y}%`,
      }) as CSSProperties,
    [x, y],
  )

  return (
    <div className="hero-spotlight" style={style} data-active={active} aria-hidden="true" />
  )
}

export default HeroSpotlight
