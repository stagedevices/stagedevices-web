import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
          variant === 'primary' && 'button-primary',
          variant === 'outline' && 'button-outline',
          variant === 'ghost' && 'border border-transparent',
          size === 'sm' && 'px-4 py-1.5 text-xs',
          className,
        )}
        type={type}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export default Button
