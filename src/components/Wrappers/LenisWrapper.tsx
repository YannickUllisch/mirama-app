'use client'
import Lenis from '@studio-freight/lenis'
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const LenisContext = createContext<Lenis>(new Lenis())

const LenisProvider: FC<PropsWithChildren> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis>(new Lenis())

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      gestureOrientation: 'vertical',
      touchMultiplier: 2,
    })

    const raf = (time: number) => {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    setLenis(lenisInstance)

    return () => {
      lenisInstance.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

export default LenisProvider
