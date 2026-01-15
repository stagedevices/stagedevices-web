import type { CSSProperties } from 'react'
import { cn } from '../../utils/cn'

type BlueprintTileProps = {
  className?: string
  style?: CSSProperties
}

const BlueprintTile = ({ className, style }: BlueprintTileProps) => {
  return (
    <div className={cn('blueprint-tile', className)} style={style} aria-hidden="true">
      <div className="blueprint-tile__grid" />
      <svg className="blueprint-tile__lines" viewBox="0 0 360 240" fill="none">
        <path d="M40 30 L320 200" />
        <path d="M70 210 L320 30" />
        <path d="M20 120 L340 120" />
      </svg>
      <svg className="blueprint-tile__tool" viewBox="0 0 360 240" fill="none">
        <path d="M90 70 L150 130 L120 160" />
        <path d="M150 130 L230 60" />
        <path d="M230 60 L250 80" />
        <path d="M210 90 L250 130" />
        <circle cx="250" cy="80" r="14" />
      </svg>
    </div>
  )
}

export default BlueprintTile
