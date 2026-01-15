import { useMemo, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../../components/ui/Button'
import Pill from '../../components/ui/Pill'
import ExploreChooserDialog from '../../components/modals/ExploreChooserDialog'
import ProductSheetDialog from '../../components/modals/ProductSheetDialog'
import HeroScanline from '../../components/backdrop/HeroScanline'
import HeroSpotlight from '../../components/backdrop/HeroSpotlight'
import DraftingTrace from '../../components/backdrop/DraftingTrace'
import { useReducedMotionSafe } from '../../utils/motion'

const products = [
  {
    id: 'synctimer',
    name: 'SyncTimer',
    icon: '/assets/icon-synctimer.png',
    label: 'Timing Device',
    bullets: ['Countdown', 'Ensemble sync', 'Cue stacks'],
    capabilities: [
      'Dual-channel clocking',
      'Stage cue sequencing',
      'Sync packets over LAN',
      'Variable tempo maps',
    ],
  },
  {
    id: 'tenney',
    name: 'Tenney',
    icon: '/assets/icon-tenney.png',
    label: 'Tuning Environment',
    bullets: ['JI lattice', 'Tuning layouts', 'Performance pads'],
    capabilities: [
      'Dynamic pitch grids',
      'Realtime intonation edits',
      'Weighted pad response',
      'Performer presets',
    ],
  },
]

const Home = () => {
  const { theme } = useTheme()
  const prefersReducedMotion = useReducedMotionSafe()
  const [hovered, setHovered] = useState(false)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })
  const [exploreOpen, setExploreOpen] = useState(false)
  const [activeProductId, setActiveProductId] = useState<string | null>(null)
  const [traceSeed, setTraceSeed] = useState(0)

  const labelDrifts = useMemo(
    () => [
      { x: 1.5, y: -1.2, duration: 12, delay: 0 },
      { x: -1.2, y: 1.4, duration: 10, delay: 0.4 },
      { x: 1.1, y: 1.1, duration: 14, delay: 0.2 },
    ],
    [],
  )

  const activeProduct = products.find((product) => product.id === activeProductId) ?? null

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x, y })
  }

  const handlePointerEnter = () => {
    setHovered(true)
    setTraceSeed(Date.now())
  }

  const handlePointerLeave = () => {
    setHovered(false)
  }

  const openProduct = (productId: string) => {
    setActiveProductId(productId)
    setExploreOpen(false)
  }

  return (
    <div className="relative pb-20 pt-24">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Pill>Blueprint Lab</Pill>
          <h1 className="text-4xl uppercase tracking-[0.4em] text-[var(--ink)] md:text-5xl">
            Stage Devices
          </h1>
          <p className="text-xl uppercase tracking-[0.3em] text-[var(--accent)]">
            Tools for the stage.
          </p>
          <p className="max-w-xl text-base text-[var(--fg)]">
            Software instruments for performance systems.
          </p>
          <div className="flex flex-wrap gap-4">
            <ExploreChooserDialog
              open={exploreOpen}
              onOpenChange={setExploreOpen}
              onSelect={openProduct}
              products={products}
              trigger={<Button type="button">Explore</Button>}
            />
            <Link
              to="/support"
              className="button-outline inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Support
            </Link>
          </div>
        </div>
        <div
          className={`hero-surface rounded-3xl p-6 ${hovered ? 'is-hovering' : ''}`}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <HeroSpotlight x={spotlight.x} y={spotlight.y} active={hovered} />
          {theme === 'blueprint' && <HeroScanline active={hovered} />}
          {theme === 'drafting' && <DraftingTrace active={hovered} seed={traceSeed} />}
          <div className="relative z-10 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">
              System Overview
            </p>
            <div className="space-y-3 text-sm text-[var(--fg)]">
              <p>Live timing, tuning, and cue geometry for performance teams.</p>
              <p>Designed for touring rigs, rehearsal studios, and modular control rooms.</p>
            </div>
            <div className="grid gap-3 text-xs uppercase tracking-[0.3em] md:grid-cols-2">
              <span className="rounded-full border border-[var(--cardBorder)] px-3 py-2">
                Multi-device sync
              </span>
              <span className="rounded-full border border-[var(--cardBorder)] px-3 py-2">
                Precision tuning
              </span>
              <span className="rounded-full border border-[var(--cardBorder)] px-3 py-2">
                Cue architecture
              </span>
              <span className="rounded-full border border-[var(--cardBorder)] px-3 py-2">
                Tour-ready profiles
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0">
            {['Signal Map', 'Grid Index', 'Stage Plot'].map((label, index) => (
              <motion.span
                key={label}
                className="annotation-label absolute"
                style={{
                  top: `${18 + index * 20}%`,
                  left: `${8 + index * 22}%`,
                }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        x: [0, labelDrifts[index].x, 0],
                        y: [0, labelDrifts[index].y, 0],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: labelDrifts[index].duration,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                        delay: labelDrifts[index].delay,
                      }
                }
              >
                {label}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto mt-20 grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {[
          {
            title: 'Systems Architecture',
            copy: 'Modular timing and tuning tools that speak to lighting, sound, and automation stacks.',
          },
          {
            title: 'Performance Readiness',
            copy: 'Stable workflows for rehearsals and touring teams with repeatable cues.',
          },
          {
            title: 'Precision Interfaces',
            copy: 'Micro-accurate transport, pitch, and control surfaces made for stage crews.',
          },
        ].map((item) => (
          <div key={item.title} className="card-glass rounded-2xl p-6">
            <h3 className="mb-3 text-lg uppercase tracking-[0.3em]">{item.title}</h3>
            <p className="text-sm text-[var(--fg)]">{item.copy}</p>
          </div>
        ))}
      </section>
      <ProductSheetDialog
        open={Boolean(activeProductId)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveProductId(null)
          }
        }}
        product={activeProduct}
      />
    </div>
  )
}

export default Home
