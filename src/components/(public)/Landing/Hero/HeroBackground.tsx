const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(circle at center, black 30%, transparent 80%)',
        }}
      />
      <div className="absolute top-[20%] -left-20 w-[120%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent -rotate-12" />
      <div className="absolute top-[60%] -left-20 w-[120%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent -rotate-6" />
    </div>
  )
}

export default HeroBackground
