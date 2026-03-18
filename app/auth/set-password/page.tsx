import SetPasswordForm from '@src/components/auth/SetPasswordForm'
import GridDecoration from '@src/components/Background/GridDecoration'
import HoverLink from '@src/components/HoverLink'
import MiramaIcon from '@src/components/MiramaIcon'
import { ArrowLeft } from 'lucide-react'

const SetPasswordPage = () => {
  return (
    <div className="relative min-h-svh w-full overflow-hidden flex flex-col">
      <GridDecoration size="40" />

      <div className="p-6 md:p-10 z-10">
        <HoverLink
          href="/auth/login"
          className="flex items-center gap-2 group w-fit"
        >
          <div className="w-8 h-8 bg-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(59,130,246,0.2)] transition-transform group-hover:-translate-x-0.5">
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
          <MiramaIcon />
        </HoverLink>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 z-10">
        <div className="w-full max-w-lg bg-background/50 backdrop-blur-sm p-8 md:p-12 border-2 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-[-25px] right-[-25px] w-[50px] h-[50px] bg-red-500/10 rotate-45 border-b border-red-500/20" />
          </div>

          <SetPasswordForm />
        </div>
      </div>

      <div className="p-10 flex justify-between items-end z-10">
        <div className="hidden md:flex items-center gap-4">
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </div>
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
            Status: Security_Challenge_Active
          </span>
        </div>

        <div className="text-[10px] font-mono text-primary/20 select-none uppercase tracking-widest">
          Auth_Node / 0xCC-04
        </div>
      </div>
    </div>
  )
}

export default SetPasswordPage
