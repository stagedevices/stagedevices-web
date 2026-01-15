const ShaderBackdrop = () => {
  return (
    <div
      className="absolute inset-0 opacity-40"
      aria-hidden="true"
      style={{
        background: 'radial-gradient(circle at 20% 20%, rgba(255,138,42,0.15), transparent 60%)',
      }}
    />
  )
}

export default ShaderBackdrop
