import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type GlassCardProps = {
  children: ReactNode
  className?: string
}

const GlassCard = ({ children, className }: GlassCardProps) => {
  return <div className={cn('card-glass rounded-2xl p-6', className)}>{children}</div>
}

export default GlassCard
