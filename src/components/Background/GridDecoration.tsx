const GridDecoration = ({
  size,
  enableCircularMask,
}: {
  size: string
  enableCircularMask?: boolean
}) => {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: enableCircularMask
          ? 'radial-gradient(circle at center, black 30%, transparent 90%)'
          : '',
      }}
    />
  )
}

export default GridDecoration
