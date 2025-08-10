import { Badge } from '../ui/badge'

const ContactFooter = () => {
  return (
    <div className="py-20 gap-y-4 flex justify-center items-center flex-col bg-secondary">
      <Badge
        variant={'outline'}
        className="inline-block border-primary text-primary px-2 py-1 border rounded-md w-fit"
      >
        Reach out to us
      </Badge>
      <span className="text-3xl font-bold text-white">
        We'd Love to Hear From You
      </span>
      <span className="text-white/80 dark:text-text-secondary gap-1 flex flex-col sm:flex-row">
        Reach out to us manually at
        <a
          href="mailto:info@mirage-studio.xyz"
          className="text-white/80 dark:text-text-secondary font-medium hover:underline underline-offset-4"
        >
          info@mirage-studio.xyz
        </a>
      </span>
    </div>
  )
}

export default ContactFooter
