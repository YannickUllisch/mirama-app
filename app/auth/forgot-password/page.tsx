import GridDecoration from '@src/components/(public)/Background/GridDecoration'
import ForgotPasswordForm from '@src/components/auth/ForgotPasswordForm'
import MiramaIcon from '@src/components/MiramaIcon'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const ForgotPasswordPage = () => {
  return (
    <div className="relative min-h-svh w-full overflow-hidden flex flex-col">
      <GridDecoration size="40" />

      {/* Header Navigation */}
      <div className="p-6 md:p-10 z-10">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 group w-fit"
        >
          <div className="w-8 h-8 bg-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(59,130,246,0.2)] transition-transform group-hover:-translate-x-0.5">
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
          <MiramaIcon />
        </Link>
      </div>

      {/* Centered Recovery Terminal */}
      <div className="flex flex-1 items-center justify-center p-6 z-10">
        <div className="w-full max-w-lg bg-background/80 backdrop-blur-md p-8 md:p-12 border-2 border-border shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
          <ForgotPasswordForm />
        </div>
      </div>

      {/* Technical Metadata */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.4em]">
          Recovery_Protocol: 0xRE-INIT
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
