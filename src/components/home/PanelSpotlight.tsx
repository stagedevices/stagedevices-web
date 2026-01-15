import type { CSSProperties } from 'react'

type PanelSpotlightProps = {
  active: boolean
  style?: CSSProperties
}

const PanelSpotlight = ({ active, style }: PanelSpotlightProps) => {
  return (
    <div
      className={`panel-spotlight ${active ? 'is-active' : ''}`}
      style={style}
      aria-hidden="true"
    />
  )
}

export default PanelSpotlight
