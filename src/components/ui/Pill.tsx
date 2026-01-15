import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type PillProps = {
  children: ReactNode
  className?: string
}

const Pill = ({ children, className }: PillProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--cardBorder)] px-3 py-1 text-[11px] uppercase tracking-[0.3em]',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Pill
