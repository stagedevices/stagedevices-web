import { Outlet, useLocation } from 'react-router-dom'
import BlueprintBackdrop from '../../components/backdrop/BlueprintBackdrop'
import CornerInstrument from './CornerInstrument'

const Shell = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {!isHome && <BlueprintBackdrop />}
      {!isHome && <CornerInstrument />}
      <main className="relative z-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default Shell
