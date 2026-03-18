const GridDecoration = ({ size }: { size: string }) => {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  )
}

export default GridDecoration
