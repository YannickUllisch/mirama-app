import Loading from '@/app/loading'
import image from '@public/test.png'
import RegisterForm from '@src/components/auth/RegisterForm'
import { AuthSocial } from '@src/components/auth/Socials'
import GridDecoration from '@src/components/Background/GridDecoration'
import MiramaIcon from '@src/components/MiramaIcon'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

const RegisterPage = () => {
  return (
    <div className="relative min-h-svh w-full overflow-hidden flex">
      <GridDecoration size="40" />

      <div className="grid w-full lg:grid-cols-2">
        <div className="relative hidden lg:flex items-center justify-center  p-20 overflow-hidden">
          <div className="absolute top-10 right-10 text-[10px] font-mono text-primary/20 rotate-90 select-none">
            SECURE_AUTH_NODE_01
          </div>

          <div className="relative w-full max-w-xl aspect-[4/5] group">
            <div className="absolute -top-6 -right-6 w-full h-full border-2 border-dashed border-primary/20 rounded-[3rem] rotate-3 transition-transform duration-500 group-hover:rotate-1" />
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-red-500/5 rounded-[3rem] -rotate-2 border-2 border-dashed border-red-500/20 group-hover:rotate-0 transition-transform duration-500" />

            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border-2 border-border shadow-2xl bg-card">
              <Suspense fallback={<Loading />}>
                <Image
                  src={image}
                  alt="Register Image"
                  priority
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Suspense>
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
          </div>
        </div>
        {/* Left Side */}
        <div className="flex flex-col p-6 md:p-10 z-10">
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(59,130,246,0.2)]">
                <ArrowLeft className="w-5 h-5 text-white" />
              </div>
              <MiramaIcon />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm space-y-8">
              <RegisterForm />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="bg-background px-4 text-muted-foreground">
                    Identity Provider
                  </span>
                </div>
              </div>
              <AuthSocial />
              <p className="text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary underline underline-offset-4 hover:text-blue-700"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
