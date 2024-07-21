import type { FC } from 'react'

interface ContainerProps {
  children: React.ReactNode
}

const Container: FC<ContainerProps> = ({ children }) => {
  return <div className="mx-auto w-full max-w-5xl">{children}</div>
}

export default Container
