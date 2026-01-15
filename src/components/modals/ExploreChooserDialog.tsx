import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import Button from '../ui/Button'
import AppIcon from '../ui/AppIcon'

type ExploreProduct = {
  id: string
  name: string
  icon: string
  bullets: string[]
}

type ExploreChooserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (productId: string) => void
  trigger: ReactNode
  products: ExploreProduct[]
}

const ExploreChooserDialog = ({
  open,
  onOpenChange,
  onSelect,
  trigger,
  products,
}: ExploreChooserDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2">
          <div className="card-glass relative rounded-3xl p-8">
            <div className="mb-6 flex items-center justify-between">
              <Dialog.Title className="text-xl uppercase tracking-[0.3em]">Explore Systems</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cardBorder)]"
                  aria-label="Close explore"
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {products.map((product) => (
                <GlassCard key={product.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AppIcon
                      src={product.icon}
                      alt={`${product.name} icon`}
                      className="h-12 w-12 rounded-xl border border-[var(--cardBorder)]"
                    />
                    <div>
                      <h3 className="text-lg uppercase tracking-[0.2em]">{product.name}</h3>
                      <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">
                        Blueprint Card
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-[var(--fg)]">
                    {product.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <Button type="button" variant="outline" onClick={() => onSelect(product.id)}>
                    View
                  </Button>
                </GlassCard>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ExploreChooserDialog
