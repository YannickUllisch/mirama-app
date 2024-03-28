import Header from '@/src/components/Header'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
export default ProtectedLayout
