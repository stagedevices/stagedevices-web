import Pill from '../../components/ui/Pill'
import Button from '../../components/ui/Button'

const Support = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-24">
      <Pill>Support</Pill>
      <h1 className="mt-4 text-3xl uppercase tracking-[0.3em]">Support Desk</h1>
      <p className="mt-4 max-w-2xl text-base text-[var(--fg)]">
        Keep your performance systems calibrated with documentation, setup guidance, and response
        checklists tailored for touring crews.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Setup Guides',
            copy: 'Signal flow, network clocking, and stage-ready configuration steps.',
          },
          {
            title: 'Cue Recovery',
            copy: 'Rapid fallback procedures and manual override tactics.',
          },
          {
            title: 'Tuning Library',
            copy: 'Reference lattices, temperament recipes, and pad layout templates.',
          },
        ].map((item) => (
          <div key={item.title} className="card-glass rounded-2xl p-6">
            <h2 className="text-sm uppercase tracking-[0.3em]">{item.title}</h2>
            <p className="mt-3 text-sm text-[var(--fg)]">{item.copy}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button type="button">Open Support</Button>
        <Button type="button" variant="outline">
          Download Checklist
        </Button>
      </div>
    </div>
  )
}

export default Support
