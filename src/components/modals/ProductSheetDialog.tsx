import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2">
          <GlassCard className="relative overflow-hidden">
            <Dialog.Close asChild>
              <button
                className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cardBorder)]"
                aria-label="Close product sheet"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
            <div className="flex flex-wrap items-center gap-4">
              <AppIcon
                src={product.icon}
                alt={`${product.name} icon`}
                className="h-14 w-14 rounded-2xl border border-[var(--cardBorder)]"
              />
              <div>
                <Dialog.Title className="text-2xl uppercase tracking-[0.3em]">
                  {product.name}
                </Dialog.Title>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
                  {product.label}
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {product.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Button type="button">Get</Button>
                  <Button type="button" variant="outline">
                    Support
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Capabilities</p>
                <ul className="space-y-2 text-sm">
                  {product.capabilities.map((capability) => (
                    <li key={capability} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full border border-[var(--cardBorder)]" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <motion.div
              className="absolute right-8 top-24 rounded border border-[var(--cardBorder)] px-3 py-1 text-[10px] uppercase tracking-[0.4em]"
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              stamped
            </motion.div>
            <motion.svg
              className="absolute left-6 top-6 h-12 w-24"
              viewBox="0 0 120 60"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M8 48 L40 20 L72 36 L108 10"
                stroke="var(--accent)"
                strokeWidth="1.2"
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
