const CropMarks = () => {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="var(--ink)" strokeWidth="0.4" opacity="0.35">
        <line x1="2" y1="6" x2="2" y2="18" />
        <line x1="2" y1="6" x2="14" y2="6" />
        <line x1="98" y1="6" x2="86" y2="6" />
        <line x1="98" y1="6" x2="98" y2="18" />
        <line x1="2" y1="94" x2="2" y2="82" />
        <line x1="2" y1="94" x2="14" y2="94" />
        <line x1="98" y1="94" x2="86" y2="94" />
        <line x1="98" y1="94" x2="98" y2="82" />
      </g>
    </svg>
  )
}

export default CropMarks
