import type { PropsWithChildren } from 'react'
// Use local shim in this Vite React project
import { CedarProvider } from '../cedar/react-shim'

export function Providers({ children }: PropsWithChildren) {
  return (
    <CedarProvider>
      {children}
    </CedarProvider>
  )
}

export default Providers

