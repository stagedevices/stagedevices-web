import * as Popover from '@radix-ui/react-popover'
import { Menu, MoonStar, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../../components/ui/Button'

const CornerInstrument = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="corner-instrument">
      <div className="corner-knob">
        <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === 'blueprint' ? <Sun size={14} /> : <MoonStar size={14} />}
          {theme === 'blueprint' ? 'Blueprint' : 'Drafting'}
        </Button>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cardBorder)] text-[var(--fg)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Open menu"
            >
              <Menu size={16} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="end"
              sideOffset={12}
              className="card-glass z-50 rounded-xl p-4 text-sm"
            >
              <nav className="flex flex-col gap-3">
                <Link to="/about" className="uppercase tracking-[0.2em]">
                  About
                </Link>
                <Link to="/support" className="uppercase tracking-[0.2em]">
                  Support
                </Link>
                <Link to="/contact" className="uppercase tracking-[0.2em]">
                  Contact
                </Link>
              </nav>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  )
}

export default CornerInstrument
