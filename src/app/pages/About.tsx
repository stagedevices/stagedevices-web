import Pill from '../../components/ui/Pill'

const About = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-24">
      <Pill>About</Pill>
      <h1 className="mt-4 text-3xl uppercase tracking-[0.3em]">Blueprint Lab Table</h1>
      <p className="mt-4 max-w-2xl text-base text-[var(--fg)]">
        Stage Devices designs performance software with the rigor of technical drafting.
        Each tool is engineered to keep ensembles aligned, tuned, and confident under pressure.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[
          {
            title: 'Methodical Interfaces',
            copy: 'Clean grid layouts, modular panels, and predictable controls for live teams.',
          },
          {
            title: 'Performance Systems',
            copy: 'Timing, tuning, and cue systems that integrate into broader stage workflows.',
          },
        ].map((item) => (
          <div key={item.title} className="card-glass rounded-2xl p-6">
            <h2 className="text-lg uppercase tracking-[0.3em]">{item.title}</h2>
            <p className="mt-3 text-sm text-[var(--fg)]">{item.copy}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
