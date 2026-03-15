import contactImage from '@public/test2.png'
import ContactForm from '@src/components/auth/ContactForm'
import { Badge } from '@src/components/ui/badge'
import Image from 'next/image'

const ContactPage = () => {
  return (
    <div className="relative min-h-svh w-full overflow-hidden flex flex-col justify-center">
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Coordinate Markers */}
      <div className="absolute top-10 left-10 text-[10px] font-mono text-blue-500/30 rotate-90 select-none">
        LOC_REF: 55.6761
      </div>
      <div className="absolute bottom-10 right-10 text-[10px] font-mono text-red-500/30 select-none">
        COMM_LINK_ACTV
      </div>

      <div className="container mx-auto px-6 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
          {/* Left: Contact Form Content */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="bg-red-500 text-white border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-2 w-fit"
              >
                Contact Portal
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.85] uppercase">
                LETS GET <br />
                <span className="text-blue-600 italic font-serif text-4xl lg:text-6xl">
                  In Contact
                </span>
              </h1>
              <p className="max-w-md text-lg text-muted-foreground font-light leading-relaxed italic border-l-4 border-red-500 pl-6">
                "Our team of engineers and strategists are ready to optimize
                your workflow. Reach out to discuss custom deployments."
              </p>
            </div>

            <div className="relative p-1 lg:p-0">
              <ContactForm />
            </div>
          </div>

          <div className="relative order-1 lg:order-2 group">
            <div className="absolute -top-6 -right-6 w-full h-full bg-blue-500/5 rounded-[3rem] rotate-3 border-2 border-dashed border-blue-500/20 -z-10 group-hover:rotate-1 transition-transform duration-500" />
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-red-500/5 rounded-[3rem] -rotate-2 border-2 border-dashed border-red-500/20 -z-10 group-hover:rotate-0 transition-transform duration-500" />

            <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-[2.5rem] border-2 border-border bg-card shadow-2xl">
              <Image
                src={contactImage}
                priority
                alt="Contact Visual"
                className="absolute inset-0 h-full w-full object-cover filter transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />

              {/* Overlay Label */}
              <div className="absolute bottom-8 right-8 bg-background/90 backdrop-blur-md px-5 py-2 rounded-2xl border border-border shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                  Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
