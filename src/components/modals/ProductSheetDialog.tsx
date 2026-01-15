import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppIcon from '../ui/AppIcon'
import Button from '../ui/Button'
import GlassCard from '../ui/GlassCard'
import { useReducedMotionSafe } from '../../utils/motion'

type ProductSheet = {
  id: string
  name: string
  icon: string
  label: string
  bullets: string[]
  capabilities: string[]
}

type ProductSheetDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductSheet | null
}

const ProductSheetDialog = ({ open, onOpenChange, product }: ProductSheetDialogProps) => {
  const prefersReducedMotion = useReducedMotionSafe()

  if (!product) {
    return null
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2">
          <GlassCard className="home-sheet relative overflow-hidden">
            <Dialog.Close asChild>
              <button
                className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] text-[var(--panel-ink)]"
                aria-label="Close product sheet"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
            <div className="flex flex-wrap items-center gap-4">
              <AppIcon
                src={product.icon}
                alt={`${product.name} icon`}
                className="home-app-icon"
              />
              <div>
                <Dialog.Title className="panel-title">{product.name}</Dialog.Title>
                <p className="panel-label">{product.label}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                <ul className="panel-bullets">
                  {product.bullets.map((bullet) => (
                    <li key={bullet}>
                      <span className="panel-bullet-dot" aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" className="home-cta">
                    Learn
                  </Button>
                  <Link className="home-cta-outline" to="/support">
                    Support
                  </Link>
                </div>
              </div>
              <div className="space-y-2">
                <p className="panel-label">Capabilities</p>
                <ul className="space-y-2 text-sm text-[var(--panel-ink)]">
                  {product.capabilities.map((capability) => (
                    <li key={capability} className="flex items-center gap-2">
                      <span className="panel-cap-dot" aria-hidden="true" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <motion.div
              className="panel-stamp"
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              indexed
            </motion.div>
            <motion.svg className="panel-schematic" viewBox="0 0 120 60" fill="none">
              <motion.path
                d="M8 48 L40 20 L72 36 L108 10"
                stroke="var(--blueprint-blue, var(--accent))"
                strokeWidth="1.1"
                strokeLinecap="round"
                initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: 'easeInOut' }}
              />
            </motion.svg>
          </GlassCard>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ProductSheetDialog
