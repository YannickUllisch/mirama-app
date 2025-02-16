'use client'
import type { FC } from 'react'
import { CircleHelp, Leaf, Shapes } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@src/components/ui/button'
import SectionHeading from '@src/components/LandingPage/SectionHeading'

const LandingPage: FC = () => {
  return (
    <>
      <div className="h-[600px] flex flex-col">
        <div className="pt-40 flex flex-col items-center overflow-hidden">
          <SectionHeading classname="h-[30px]">
            <Shapes className="w-5 h-5" />
            <span>Project & Task Management Tool</span>
          </SectionHeading>
          <span className="font-serif mt-5 text-5xl md:mt-2 md:text-9xl text-center font-bold">
            COMING SOON..
          </span>
          {/* <div className="text-center flex flex-col items-center gap-1 mb-24">
            <h2
              style={{ fontSize: 50 }}
              className="font-bold text-wrap text-text"
            >
              Manage. Collaborate. Achieve.
            </h2>
            <p className="text-text-secondary font-medium">
              Lower text not defined yet
            </p>
            <div className="flex justify-center mt-3 gap-3">
              <Link
                href={'/auth/register'}
                className="bg-primary text-white px-4 py-2 hover:bg-primary-dark rounded-lg"
              >
                Get started
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </>
  )
}

export default LandingPage
