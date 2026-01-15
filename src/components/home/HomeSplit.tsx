import { useMemo, useState } from 'react'
import CenterSeam from './CenterSeam'
import SplitPanel from './SplitPanel'
import ProductSheetDialog from '../modals/ProductSheetDialog'

const products = [
  {
    id: 'synctimer',
    name: 'SyncTimer',
    icon: '/assets/icon-synctimer.png',
    label: 'Timing Device',
    bullets: ['Countdown', 'Ensemble sync', 'Cues'],
    capabilities: [
      'Scene countdown lanes',
      'Cue stack linking',
      'Network sync beacons',
      'Tempo map anchors',
      'Redundant clocking',
    ],
    annotations: [
      { label: 'clock bus', top: '18%', left: '12%' },
      { label: 'cue gate', top: '62%', left: '18%' },
    ],
  },
  {
    id: 'tenney',
    name: 'Tenney',
    icon: '/assets/icon-tenney.png',
    label: 'Tuning Environment',
    bullets: ['JI lattice', 'Tuning', 'Pads'],
    capabilities: [
      'Lattice editor',
      'Dynamic temperaments',
      'Pad zoning modes',
      'Pitch capture',
      'Performer presets',
    ],
    annotations: [
      { label: 'ratio map', top: '22%', left: '70%' },
      { label: 'pad lattice', top: '60%', left: '64%' },
    ],
  },
]

const HomeSplit = () => {
  const [activeProductId, setActiveProductId] = useState<string | null>(null)

  const activeProduct = useMemo(
    () => products.find((product) => product.id === activeProductId) ?? null,
    [activeProductId],
  )

  return (
    <div className="home-split">
      <div className="home-split__grid" aria-hidden="true" />
      <header className="home-split__header">
        <p className="home-split__brand">Stage Devices</p>
        <p className="home-split__tagline">Tools for the stage.</p>
      </header>
      <div className="home-split__panels">
        <SplitPanel
          product={products[0]}
          onView={() => setActiveProductId(products[0].id)}
        />
        <CenterSeam />
        <SplitPanel
          product={products[1]}
          onView={() => setActiveProductId(products[1].id)}
        />
      </div>
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

export default HomeSplit
