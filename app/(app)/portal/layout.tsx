// app/(app)/(portal)/layout.tsx
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'

const PortalLayout = ({ children }: { children: React.ReactNode }) => (
  <SessionWrapper>
    <QueryClientWrapper>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientWrapper>
  </SessionWrapper>
)

export default PortalLayout
