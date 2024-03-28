import Header from '@/src/components/header/Header'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
export default ProtectedLayout
