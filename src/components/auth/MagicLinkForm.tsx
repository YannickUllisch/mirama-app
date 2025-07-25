import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { resendLogin } from '@src/lib/auth/login'

const MagicLinkForm = () => {
  return (
    <form action={resendLogin}>
      <div className="flex w-full flex-col">
        <Input type="email" placeholder="email" name="email" />
        <Button>Sign in with Resend</Button>
      </div>
    </form>
  )
}

export default MagicLinkForm
