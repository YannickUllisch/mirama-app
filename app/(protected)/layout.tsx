import Header from '@/src/components/test/Header'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
export default ProtectedLayout
