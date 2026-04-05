import VerifyForm from '@src/components/auth/VerifyForm'
import HoverLink from '@src/components/HoverLink'
import MiramaIcon from '@src/components/MiramaIcon'
import GridDecoration from '@src/modules/shared/components/Background/GridDecoration'
import { ArrowLeft } from 'lucide-react'

const VerifyPage = () => {
  return (
    <div className="relative min-h-svh w-full overflow-hidden flex flex-col">
      <GridDecoration size="40" />

      <div className="p-6 md:p-10 z-10">
        <HoverLink
          href="/auth/register"
          className="flex items-center gap-2 group w-fit"
        >
          <div className="w-8 h-8 bg-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(59,130,246,0.2)] transition-transform group-hover:-translate-x-0.5">
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
          <MiramaIcon />
        </HoverLink>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 z-10">
        <div className="w-full max-w-lg bg-background/50 backdrop-blur-xs p-8 md:p-12 border-2 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-[-25px] right-[-25px] w-[50px] h-[50px] bg-red-500/10 rotate-45 border-b border-red-500/20" />
          </div>

          <VerifyForm />
        </div>
      </div>

      <div className="absolute bottom-10 right-10 text-[10px] font-mono text-primary/20 select-none uppercase tracking-widest hidden md:block">
        Verification_Node / 0x77A
      </div>
    </div>
  )
}

export default VerifyPage
