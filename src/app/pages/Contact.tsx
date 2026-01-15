import Pill from '../../components/ui/Pill'

const Contact = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-24">
      <Pill>Contact</Pill>
      <h1 className="mt-4 text-3xl uppercase tracking-[0.3em]">Contact Stage Devices</h1>
      <p className="mt-4 max-w-2xl text-base text-[var(--fg)]">
        Reach out for integration planning, licensing, or performance lab scheduling.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card-glass rounded-2xl p-6">
          <h2 className="text-sm uppercase tracking-[0.3em]">Studio</h2>
          <p className="mt-3 text-sm text-[var(--fg)]">hello@stagedevices.io</p>
          <p className="text-sm text-[var(--fg)]">Remote labs available by request.</p>
        </div>
        <div className="card-glass rounded-2xl p-6">
          <h2 className="text-sm uppercase tracking-[0.3em]">Touring</h2>
          <p className="mt-3 text-sm text-[var(--fg)]">support@stagedevices.io</p>
          <p className="text-sm text-[var(--fg)]">On-call performance coverage.</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
