import SetPasswordForm from '@src/components/auth/SetPasswordForm'
import Link from 'next/link'

const SetPasswordPage = () => {
  return (
    <div className="flex min-h-svh flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold">.mirama</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <SetPasswordForm />
        </div>
      </div>
    </div>
  )
}

export default SetPasswordPage
