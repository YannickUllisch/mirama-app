import contactImage from '@public/test2.png'
import ContactForm from '@src/components/auth/ContactForm'
import Image from 'next/image'

const ContactPage = () => {
  return (
    <div>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="relative hidden bg-muted lg:block">
          <Image
            src={contactImage}
            priority
            alt="ContactImage"
            className="absolute inset-0 h-full w-full object-cover filter"
          />
        </div>
        <div className="flex flex-col gap-4 p-6 md:p-10 ">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xl p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
