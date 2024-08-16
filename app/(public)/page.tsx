'use client'
import type { FC } from 'react'
import { CircleHelp, Leaf } from 'lucide-react'
import Link from 'next/link'
import HoverBox from '@src/components/LandingPage/HoverCard'
import { Button } from '@src/components/ui/button'
import SectionHeading from '@src/components/LandingPage/SectionHeading'

export const Home: FC = () => {
  return (
    <>
      <div className="mb-[-15rem] flex flex-col">
        <div className="pt-40 flex flex-col items-center overflow-hidden">
          <SectionHeading classname="h-[30px]">
            <Leaf className="w-5 h-5" />
            <span>Project & Task Management Tool</span>
          </SectionHeading>
          <div className="text-center flex flex-col items-center gap-1 mb-24">
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
                href={''}
                className="bg-primary text-white px-4 py-2 hover:bg-primary-dark rounded-lg"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>

        <div className="md:mx-[20%] mx-[10%] mt-5 ">
          <HoverBox>
            <div className="flex flex-col items-center p-3">
              <Button className="min-w-[80px] h-[20px] bg-text-inverted hover:text-text px-4 py-2 rounded-xl " />
            </div>
            <div className="flex flex-col items-center pt-20">
              <div className="flex text-white">
                <Leaf className="w-20 h-20" />
                <Leaf className="w-24 h-24 mx-4" />
                <Leaf className="w-20 h-20" />
              </div>
              <h3 className="text-white text-7xl font-extrabold">MIRAGE.</h3>
            </div>
          </HoverBox>
        </div>
      </div>

      <div className="h-[300px] bg-primary dark:bg-neutral-950/70" />

      <div className="bg-neutral-100 dark:bg-neutral-950/70 h-[500px]">
        <div className="py-8 px-2 mx-10 flex flex-col justify-center items-center gap-5 text-center">
          <SectionHeading classname="h-[30px] w-[120px]">
            <CircleHelp className="w-5 h-5" />
            <span>Why Mirage</span>
          </SectionHeading>
          <h2 className="font-bold text-6xl">
            Managing Projects <br /> made Effortless
          </h2>
          <p className="text-text-secondary">
            Effortlessly manage projects with our powerful SaaS tool. <br />
            Boost productivity, enhance collaboration, and keep your team on{' '}
            <br />
            track with our user-friendly platform designed for seamless project
            and task management.
          </p>
        </div>
      </div>

      <div className="bg-primary text-white h-[700px] flex justify-center items-center">
        COMING SOON
      </div>
    </>
  )
}

export default Home
