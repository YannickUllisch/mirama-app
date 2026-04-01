import contactImage from '@public/test2.png'
import GridDecoration from '@src/components/(public)/Background/GridDecoration'
import ContactForm from '@src/components/auth/ContactForm'
import { Badge } from '@src/components/ui/badge'
import Image from 'next/image'

const ContactPage = () => {
  return (
    <div className="relative min-h-svh w-full overflow-hidden flex flex-col justify-center">
      <GridDecoration size="30" />

      <div className="absolute top-6 left-6 text-[9px] font-mono text-blue-500/30 rotate-90 select-none uppercase">
        LOC_REF: 55.6761
      </div>
      <div className="absolute bottom-6 right-6 text-[9px] font-mono text-red-500/30 select-none uppercase">
        COMM_LINK_ACTV
      </div>

      <div className="container mx-auto px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="bg-red-500 text-white border-none px-3 py-0.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-md -rotate-1 w-fit"
              >
                Contact Portal
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
                LETS GET <br />
                <span className="text-blue-600 italic font-serif text-3xl lg:text-5xl">
                  In Contact
                </span>
              </h1>
              <p className="max-w-sm text-sm lg:text-base text-muted-foreground font-light leading-relaxed italic border-l-2 border-red-500 pl-4">
                Our team is ready to optimize your workflow. Reach out for
                custom deployments.
              </p>
            </div>
            <div className="relative">
              <ContactForm />
            </div>
          </div>

          <div className="relative order-1 lg:order-2 group max-w-xl mx-auto lg:ml-auto w-full">
            <div className="absolute -top-3 -right-3 w-full h-full bg-blue-500/5 rounded-4xl rotate-2 border border-dashed border-blue-500/20 -z-10 group-hover:rotate-1 transition-transform duration-500" />
            <div className="absolute -bottom-2 -left-2 w-full h-full bg-red-500/5 rounded-4xl -rotate-1 border border-dashed border-red-500/20 -z-10 group-hover:rotate-0 transition-transform duration-500" />

            <div className="relative aspect-square lg:aspect-4/4.5 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
              <Image
                src={contactImage}
                priority
                alt="Contact Visual"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-tertiary/5 mix-blend-multiply" />

              <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-xs px-3 py-1 rounded-lg border border-border shadow-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-foreground">
                  Get_In_Touch
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
