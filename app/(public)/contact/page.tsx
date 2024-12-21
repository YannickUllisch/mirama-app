'use client'
import React from 'react'
import contactImage from '@public/test2.png'
import Image from 'next/image'
import ContactForm from '@src/components/auth/ContactForm'

const ContactPage = () => {
  return (
    <div>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="relative hidden bg-muted lg:block">
          <Image
            src={contactImage}
            priority
            alt="ContactImage"
            className="absolute inset-0 h-full w-full object-cover filter  brightness-[1.1] hue-rotate-[-40deg] scale-x-[-1]"
          />
        </div>
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
