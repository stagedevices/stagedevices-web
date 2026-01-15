import { useState } from 'react'

type AppIconProps = {
  src: string
  alt: string
  className?: string
}

const AppIcon = ({ src, alt, className }: AppIconProps) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <svg
        viewBox="0 0 64 64"
        className={className}
        aria-label={alt}
        role="img"
      >
        <rect x="10" y="10" width="44" height="44" rx="10" fill="none" stroke="var(--accent)" />
        <path d="M20 36 L32 24 L44 36" stroke="var(--ink)" strokeWidth="2" fill="none" />
        <circle cx="32" cy="20" r="3" fill="var(--accent)" />
      </svg>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  )
}

export default AppIcon
